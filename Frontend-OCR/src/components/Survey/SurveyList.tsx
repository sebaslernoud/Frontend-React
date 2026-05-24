import { useState, useMemo } from 'react';
import { SurveyCard } from './SurveyCard';
import SurveyFilters from './SurveyFilter';
import SurveyPagination from './SurveyPagination';
import './SurveyList.css';

interface SurveyItem {
  id: number;
  familyName: string;
  date: string;
  status: 'Pendiente' | 'Revisado';
  fileType: string;
}

const SurveyList = () => {
  //Estados para filtros y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 16; 

  //Mock de datos con nombres reales y estados mixtos
  const allSurveys: SurveyItem[] = useMemo(() => {
    const families = [
      'García', 'Rodríguez', 'Pérez', 'López', 
      'Martínez', 'Fernández', 'González', 'Sánchez', 
      'Díaz', 'Torres', 'Ramírez', 'Flores', 
      'Acosta', 'Benítez', 'Castro', 'Ruiz'
    ];
    
    // Generamos 40 elementos para que tengamos varias páginas de prueba
    return Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      familyName: `Familia ${families[i % families.length]}`,
      date: '12/05/2026',
      // Alternamos estados para probar los filtros
      status: i % 3 === 0 ? 'Revisado' : 'Pendiente', 
      fileType: 'PDF'
    }));
  }, []);

  //LÓGICA DE FILTRADO (Se ejecuta cada vez que cambia el buscador o el select)
  const filteredSurveys = useMemo(() => {
    // Volvemos a la página 1 si el usuario está filtrando para evitar quedar en una página vacía
    return allSurveys.filter((survey) => {
      const matchesSearch = survey.familyName.toLowerCase().includes(searchTerm.toLowerCase()) || survey.date.includes(searchTerm);
      const matchesStatus = statusFilter === 'Todos' || survey.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allSurveys, searchTerm, statusFilter]);

  // Al mutar los filtros, si la página actual quedó fuera de rango, la reseteamos
  const totalPages = Math.ceil(filteredSurveys.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;

  // 5. LÓGICA DE PAGINACIÓN (Corta el array filtrado para mostrar solo 16 de esa página)
  const displayedSurveys = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredSurveys.slice(startIndex, endIndex);
  }, [filteredSurveys, safeCurrentPage]);

  return (
    <div className="survey-list-wrapper">
      {/* Filtros arriba de la grilla */}
      <SurveyFilters 
        searchTerm={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
      />

      {/* Grilla de Tarjetas */}
      <div className="survey-grid">
        {displayedSurveys.map((survey) => (
          <SurveyCard
            key={survey.id}
            title={survey.familyName}
            description={survey.date}
            status={survey.status}
          />
        ))}
        {displayedSurveys.length === 0 && (
          <p className="no-results">No se encontraron encuestas que coincidan.</p>
        )}
      </div>

      {/* Paginado abajo de la grilla */}
      <SurveyPagination 
        currentPage={safeCurrentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default SurveyList;