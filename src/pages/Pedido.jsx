import React, { useState, useEffect, useMemo, useContext } from 'react';
import { FaPlus, FaSearch, FaShoppingCart, FaExclamationCircle, FaFilter, FaArrowLeft } from 'react-icons/fa';
import PedidoList from '../components/pedido/PedidoList';
import PedidoForm from '../components/pedido/PedidoForm';
import PedidoDetalle from '../components/pedido/PedidoDetalle';
import pedidoService from '../services/pedidoService';
import usuarioService from '../services/usuarioService';
import { AuthContext } from '../context/AuthContext';
import '../assets/css/Management.css';
import { alertSuccess, alertError, alertConfirm } from "../utils/alerts";
import { ESTADOS_PEDIDO } from '../constants/pedidoConstants';

const Pedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [showDetalle, setShowDetalle] = useState(false);
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [detalleLoading, setDetalleLoading] = useState(false);
    const [usuarios, setUsuarios] = useState({});
    const [usuariosLoading, setUsuariosLoading] = useState(false);

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    const [estadoFilter, setEstadoFilter] = useState('');

    // Obtener el usuario del contexto
    const { user } = useContext(AuthContext);

    // Cargar pedidos
    const loadPedidos = async () => {
        setLoading(true);
        setError('');
        try {
            let data;

            // Si el usuario es rol 2 (cliente), cargar solo sus pedidos
            if (user?.idRol === 2) {
                // Filtrar en frontend (solución más simple)
                const todosPedidos = await pedidoService.get();
                data = todosPedidos.filter(pedido =>
                    pedido.idUsuario === user.idUsuario
                );
            } else {
                // Para otros roles, cargar todos los pedidos
                data = await pedidoService.get();
            }

            setPedidos(data);

            // Después de cargar pedidos, cargar usuarios (solo si no es cliente)
            if (user?.idRol !== 2) {
                await loadUsuarios(data);
            } else {
                // Si es cliente, no necesitamos cargar usuarios, solo su info
                setUsuarios({
                    [user.idUsuario]: {
                        nombre: user.nombre,
                        email: user.email
                    }
                });
            }
        } catch (err) {
            setError(err.message || 'Error al cargar los pedidos');
            console.error('Error cargando pedidos:', err);
        } finally {
            setLoading(false);
        }
    };

    // Función para cargar usuarios basados en los pedidos
    const loadUsuarios = async (pedidosData) => {
        if (!pedidosData || pedidosData.length === 0) return;

        setUsuariosLoading(true);
        try {
            const idsUsuarios = [...new Set(pedidosData.map(p => p.idUsuario).filter(id => id))];

            if (idsUsuarios.length === 0) {
                setUsuarios({});
                return;
            }

            // Intentar cargar todos los usuarios de una vez si existe un método bulk
            try {
                const usuariosData = await usuarioService.getById(idsUsuarios);

                // Crear mapa de usuarios
                const usuariosMap = {};
                usuariosData.forEach(usuario => {
                    if (usuario && usuario.idUsuario) {
                        usuariosMap[usuario.idUsuario] = {
                            nombre: usuario.nombre || usuario.nombres || `Cliente #${usuario.idUsuario}`,
                            email: usuario.email || usuario.correo || ''
                        };
                    }
                });

                setUsuarios(usuariosMap);
            } catch (bulkError) {
                // Si no hay método bulk, cargar individualmente
                const usuariosPromises = idsUsuarios.map(id =>
                    usuarioService.getById(id)
                        .then(usuario => ({
                            id: usuario.idUsuario,
                            data: {
                                nombre: usuario.nombre || usuario.nombres || `Cliente #${usuario.idUsuario}`,
                                email: usuario.email || usuario.correo || ''
                            }
                        }))
                        .catch(err => {
                            console.error(`Error cargando usuario ${id}:`, err);
                            return {
                                id: id,
                                data: {
                                    nombre: `Cliente #${id}`,
                                    email: ''
                                }
                            };
                        })
                );

                const usuariosResults = await Promise.all(usuariosPromises);
                const usuariosMap = {};
                usuariosResults.forEach(result => {
                    usuariosMap[result.id] = result.data;
                });

                setUsuarios(usuariosMap);
            }
        } catch (err) {
            console.error('Error cargando usuarios:', err);
        } finally {
            setUsuariosLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            loadPedidos();
        }
    }, [user]);

    // Filtrado y paginación
    const filteredPedidos = useMemo(() => {
        let result = [...pedidos];

        if (estadoFilter) {
            result = result.filter(p => p.estado.toUpperCase() === estadoFilter.toUpperCase());
        }

        if (searchTerm.trim() !== '') {
            const term = searchTerm.toLowerCase();
            result = result.filter(p => {
                // Buscar en código
                if (p.codigo.toLowerCase().includes(term)) return true;

                // Buscar en tipo de pago
                if (p.tipoPago.toLowerCase().includes(term)) return true;

                // Buscar en información del usuario desde el mapa
                const usuarioInfo = usuarios[p.idUsuario];
                if (usuarioInfo) {
                    if (usuarioInfo.nombre.toLowerCase().includes(term)) return true;
                    if (usuarioInfo.email && usuarioInfo.email.toLowerCase().includes(term)) return true;
                }

                return false;
            });
        }

        return result;
    }, [pedidos, searchTerm, estadoFilter, usuarios]);

    const currentPagePedidos = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredPedidos.slice(startIndex, endIndex);
    }, [filteredPedidos, currentPage, itemsPerPage]);

    const totalItems = filteredPedidos.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    useEffect(() => {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [totalPages, currentPage]);

    // Handlers
    const handleCreate = () => {
        setShowForm(true);
        setShowDetalle(false);
        setSelectedPedido(null);
    };

    const handleView = async (pedido) => {
        setSelectedPedido(pedido);
        setDetalleLoading(true);
        setShowDetalle(true);
        setShowForm(false);

        try {
            // Cargar pedido completo
            const data = await pedidoService.getById(pedido.idPedido);
            setSelectedPedido(data);
        } catch (err) {
            alertError("Error", "No se pudo cargar el detalle del pedido");
            console.error('Error cargando pedido:', err);
        } finally {
            setDetalleLoading(false);
        }
    };

    const handleCloseDetalle = () => {
        setShowDetalle(false);
        setSelectedPedido(null);
    };

    const handleCancel = async (id) => {
        const result = await alertConfirm(
            "¿Cancelar pedido?",
            "Esta acción anulará el pedido y revertirá el stock de productos. ¿Desea continuar?"
        );

        if (!result.isConfirmed) return;

        try {
            await pedidoService.cancelar(id);
            alertSuccess("Pedido cancelado", "El pedido fue anulado y el stock revertido.");
            await loadPedidos();

            // Si estamos viendo el detalle de este pedido, cerrarlo
            if (selectedPedido && selectedPedido.idPedido === id) {
                handleCloseDetalle();
            }
        } catch (err) {
            alertError("Error", err.message);
        }
    };

    const handleFormSubmit = async (pedidoData) => {
        try {
            await pedidoService.create(pedidoData);
            alertSuccess("Pedido creado", "El pedido fue registrado exitosamente.");

            setShowForm(false);
            await loadPedidos();
        } catch (err) {
            alertError("Error en formulario", err.message);
            throw err;
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const handleSearchChange = (value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    };

    const handleEstadoFilterChange = (value) => {
        setEstadoFilter(value);
        setCurrentPage(1);
    };

    // Función para recargar pedido después de cambiar estado
    const handleEstadoChange = async () => {
        await loadPedidos();
        if (selectedPedido) {
            const data = await pedidoService.getById(selectedPedido.idPedido);
            setSelectedPedido(data);
        }
    };

    // Componente de paginación simple
    const Pagination = () => {
        if (totalPages <= 1) return null;

        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="management-pagination">
                <div className="pagination-info">
                    Mostrando {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalItems)} de {totalItems}
                </div>

                <div className="pagination-controls">
                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        &lt;
                    </button>

                    <div className="pagination-numbers">
                        {pageNumbers.map(number => (
                            <button
                                key={number}
                                className={`pagination-number ${currentPage === number ? 'active' : ''}`}
                                onClick={() => handlePageChange(number)}
                            >
                                {number}
                            </button>
                        ))}
                    </div>

                    <button
                        className="pagination-btn"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        &gt;
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="management-container">
            <div className="management-header">
                {showDetalle ? (
                    <>
                        <button
                            onClick={handleCloseDetalle}
                            className="btn-management btn-management-secondary"
                            style={{ marginRight: '12px' }}
                        >
                            <FaArrowLeft style={{ marginRight: 6 }} /> Volver a Pedidos
                        </button>
                        <h1 className="management-title">
                            <FaShoppingCart style={{ marginRight: 8 }} />
                            Pedido #{selectedPedido?.idPedido}
                        </h1>
                    </>
                ) : (
                    <>
                        <h1 className="management-title">
                            <FaShoppingCart style={{ marginRight: 8 }} />
                            {showForm ? 'Crear Nuevo Pedido' : (user?.idRol === 2 ? 'Mis Pedidos' : 'Gestión de Pedidos')}
                        </h1>
                        {/* Boton visible solo para administradores y empleados */}
                        {!showForm && user?.idRol !== 2 && (
                            <button onClick={handleCreate} className="btn-management">
                                <FaPlus /> Nuevo Pedido
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* FILTROS - SOLO EN LISTA */}
            {!showForm && !showDetalle && (
                <div className="management-filters-pedidos">
                    <div className="search-input-pedidos">
                        <FaSearch className="search-icon-pedidos" />
                        <input
                            type="text"
                            placeholder="Buscar por código, cliente, tipo pago..."
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                        />
                    </div>

                    <div className="filters-right">
                        <div className="filter-select-pedidos">
                            <select
                                value={estadoFilter}
                                onChange={(e) => handleEstadoFilterChange(e.target.value)}
                            >
                                <option value="">Todos los estados</option>
                                {ESTADOS_PEDIDO.map((estado) => (
                                    <option key={estado.value} value={estado.value}>
                                        {estado.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="alert-message alert-error">
                    <FaExclamationCircle />
                    {error}
                </div>
            )}

            {/* CONTENIDO PRINCIPAL */}
            {showForm ? (
                <PedidoForm
                    onSubmit={handleFormSubmit}
                    onCancel={handleCancelForm}
                />
            ) : showDetalle ? (
                <PedidoDetalle
                    pedido={selectedPedido}
                    loading={detalleLoading}
                    onCancel={handleCancel}
                    onEstadoChange={handleEstadoChange}
                />
            ) : (
                <>
                    <PedidoList
                        pedidos={currentPagePedidos}
                        loading={loading || usuariosLoading}
                        usuarios={usuarios}
                        onView={handleView}
                        onCancel={handleCancel}
                        usuarioLogueado={user}
                    />
                    <Pagination />
                </>
            )}
        </div>
    );
};

export default Pedidos;