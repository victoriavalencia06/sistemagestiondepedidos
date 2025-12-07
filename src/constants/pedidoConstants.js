export const TIPOS_PAGO = [
    { value: 'EFECTIVO', label: 'Efectivo' },
    { value: 'TARJETA', label: 'Tarjeta' },
    { value: 'TRANSFERENCIA', label: 'Transferencia' },
    { value: 'YAPE', label: 'Yape' },
    { value: 'PLIN', label: 'Plin' },
    { value: 'OTRO', label: 'Otro' }
];

export const ESTADOS_PEDIDO = [
    { value: 'PENDIENTE', label: 'Pendiente' },
    { value: 'PROCESANDO', label: 'Procesando' },
    { value: 'COMPLETADO', label: 'Completado' },
    { value: 'CANCELADO', label: 'Cancelado' },
    { value: 'ENTREGADO', label: 'Entregado' }
];

export const getTipoPagoLabel = (tipo) => {
    const tipoObj = TIPOS_PAGO.find(t => t.value === tipo);
    return tipoObj ? tipoObj.label : tipo;
};

export const getEstadoLabel = (estado) => {
    const estadoObj = ESTADOS_PEDIDO.find(e => e.value === estado);
    return estadoObj ? estadoObj.label : estado;
};