// src/components/common/Pagination.jsx
import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, totalItems, itemsPerPage, onPageChange }) => {

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 3;

        const currentBlock = Math.floor((currentPage - 1) / maxVisiblePages);

        const startPage = currentBlock * maxVisiblePages + 1;
        const endPage = Math.min(startPage + maxVisiblePages - 1, totalPages);

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    };

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className="management-pagination">
            <div className="pagination-info">
                Mostrando {startItem}-{endItem} de {totalItems}
            </div>

            <nav aria-label="Page navigation">
                <ul className="pagination justify-content-center">

                    {/* Flecha izquierda */}
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <FaChevronLeft />
                        </button>
                    </li>

                    {/* Números de página */}
                    {getPageNumbers().map(page => (
                        <li
                            key={page}
                            className={`page-item ${currentPage === page ? 'active' : ''}`}
                        >
                            <button
                                className="page-link"
                                onClick={() => onPageChange(page)}
                            >
                                {page}
                            </button>
                        </li>
                    ))}

                    {/* Flecha derecha */}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                        <button
                            className="page-link"
                            onClick={() => onPageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <FaChevronRight />
                        </button>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Pagination;