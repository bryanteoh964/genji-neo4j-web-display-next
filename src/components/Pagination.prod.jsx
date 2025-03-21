import React from 'react';
import styles from '../styles/pages/pagination.module.css';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  disabled = false,
  className = '' 
}) => {
  return (
    <div className={`${styles.pagination} ${className}`}>
      <button
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1 || disabled}
        className={styles.pageButton}
      >
        First
      </button>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
        className={styles.pageButton}
      >
        Previous
      </button>
      <span className={styles.pageInfo}>
        {currentPage} / {totalPages || 1}
      </span>
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
        className={styles.pageButton}
      >
        Next
      </button>
      <button
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages || disabled}
        className={styles.pageButton}
      >
        Last
      </button>
    </div>
  );
};

export default Pagination;