import React from 'react';
import { IconChevron } from '../IconChevron';
import './Pagination.scss';

export function Pagination({
    totalItems,
    itemsPerPage,
    currentPage,
    onPageChange,
    onItemsPerPageChange,
    pageSizeOptions = [10, 20, 50, 100]
}) {
    const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));

    // Safety check for currentPage
    const page = Math.min(Math.max(1, currentPage), totalPages);

    const handlePrev = () => {
        if (page > 1) onPageChange(page - 1);
    };

    const handleNext = () => {
        if (page < totalPages) onPageChange(page + 1);
    };

    return (
        <div className="data-pagination">
            <div className="pagination-info desktop-only">
                Hiển thị <span>{Math.min((page - 1) * itemsPerPage + 1, totalItems)}</span> -
                <span>{Math.min(page * itemsPerPage, totalItems)}</span> trong
                <span>{totalItems}</span> mục
            </div>

            <div className="pagination-controls">
                <div className="page-size-selector">
                    <select
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                    >
                        {pageSizeOptions.map(size => (
                            <option key={size} value={size}>{size} / trang</option>
                        ))}
                    </select>
                </div>

                <div className="page-nav">
                    <button
                        className="nav-btn"
                        onClick={handlePrev}
                        disabled={page === 1}
                        aria-label="Trang trước"
                    >
                        <IconChevron direction="left" />
                    </button>

                    <span className="page-indicator">
                        Trang <strong>{page}</strong> / {totalPages}
                    </span>

                    <button
                        className="nav-btn"
                        onClick={handleNext}
                        disabled={page === totalPages}
                        aria-label="Trang sau"
                    >
                        <IconChevron direction="right" />
                    </button>
                </div>
            </div>
        </div>
    );
}
