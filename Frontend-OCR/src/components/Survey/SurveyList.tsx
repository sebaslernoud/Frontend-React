import { useState, useMemo } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { SurveyCard } from './SurveyCard';
import SurveyFilters from './SurveyFilter';
import SurveyPagination from './SurveyPagination';

interface SurveyItem {
  id: number;
  familyName: string;
  date: string;
  status: 'Pendiente' | 'Revisado';
  fileType: string;
}

const SurveyList = () => {
  // Estados para filtros y paginación
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  
  const ITEMS_PER_PAGE = 16; 

  // Mock de datos con nombres reales y estados mixtos
  const allSurveys: SurveyItem[] = useMemo(() => {
    const families = [
      'García', 'Rodríguez', 'Pérez', 'López', 
      'Martínez', 'Fernández', 'González', 'Sánchez', 
      'Díaz', 'Torres', 'Ramírez', 'Flores', 
      'Acosta', 'Benítez', 'Castro', 'Ruiz'
    ];
    
    // Generamos 100 elementos para que tengamos varias páginas de prueba
    return Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      familyName: `Familia ${families[i % families.length]}`,
      date: '12/05/2026',
      // Alternamos estados para probar los filtros
      status: i % 3 === 0 ? 'Revisado' : 'Pendiente', 
      fileType: 'PDF'
    }));
  }, []);

  // LÓGICA DE FILTRADO (Se ejecuta cada vez que cambia el buscador o el select)
  const filteredSurveys = useMemo(() => {
    const cleanSearch = searchTerm
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    return allSurveys.filter((survey) => {
      const cleanFamilyName = survey.familyName
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

      const matchesSearch = cleanFamilyName.includes(cleanSearch) || survey.date.includes(searchTerm);
      const matchesStatus = statusFilter === 'Todos' || survey.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [allSurveys, searchTerm, statusFilter]);

  // Al mutar los filtros, si la página actual quedó fuera de rango, la reseteamos
  const totalPages = Math.ceil(filteredSurveys.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;

  // LÓGICA DE PAGINACIÓN (Corta el array filtrado para mostrar solo 16 de esa página)
  const displayedSurveys = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredSurveys.slice(startIndex, endIndex);
  }, [filteredSurveys, safeCurrentPage]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      {/* Filtros arriba de la grilla */}
      <SurveyFilters 
        searchTerm={searchTerm}
        onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
      />

      {/* Grilla de Tarjetas */}
      <Grid container spacing={2.5}>
        {displayedSurveys.map((survey) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={survey.id}>
            <SurveyCard
              id={survey.id}
              title={survey.familyName}
              description={survey.date}
              status={survey.status}
            />
          </Grid>
        ))}
      </Grid>

      {displayedSurveys.length === 0 && (
        <Box sx={{ width: '100%', py: 8, display: 'flex', justifyContent: 'center' }}>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary', 
              fontSize: '16px' 
            }}
          >
            No se encontraron encuestas que coincidan.
          </Typography>
        </Box>
      )}

      {/* Paginado abajo de la grilla */}
      {totalPages > 1 && (
        <SurveyPagination 
          currentPage={safeCurrentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </Box>
  );
};

export default SurveyList;