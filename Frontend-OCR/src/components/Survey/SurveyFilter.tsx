import React from 'react';
import './SurveyFilter.css'; 

interface SurveyFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

const SurveyFilters: React.FC<SurveyFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) => {
  return (
    <div className="survey-filters-container">
      {/* Buscador */}
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          type="text"
          placeholder="Buscar familia o fecha..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Selector de Estado */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="status-select"
      >
        <option value="Todos">Todos</option>
        <option value="Pendiente">Pendiente</option>
        <option value="Revisado">Revisado</option>
      </select>
    </div>
  );
};

export default SurveyFilters;