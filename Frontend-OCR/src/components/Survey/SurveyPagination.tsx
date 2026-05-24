import React from 'react';
import './SurveyPagination.css';

interface SurveyPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const SurveyPagination: React.FC<SurveyPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Genera un array con los números de página [1, 2, 3...]
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="survey-pagination">
      {/* Botón Anterior */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="nav-button"
      >
        ← Anterior
      </button>

      {/* Números de Páginas */}
      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`page-number ${currentPage === page ? 'active' : ''}`}
        >
          {page}
        </button>
      ))}

      {/* Botón Siguiente */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="nav-button next"
      >
        Siguiente →
      </button>
    </div>
  );
};

export default SurveyPagination;