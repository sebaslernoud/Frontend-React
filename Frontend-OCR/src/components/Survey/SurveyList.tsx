// src/components/Survey/SurveyList.tsx
import { useState, useMemo } from 'react';
import { Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { SurveyCard } from './SurveyCard';
import SurveyFilters from './SurveyFilter';
import SurveyPagination from './SurveyPagination';
import { useRelevamientosPreview } from '../../hooks/useRelevamientos';
import { formatFecha } from '../../services/airTableService';

const ITEMS_PER_PAGE = 16;

const SurveyList = () => {
  const { data, loading, error } = useRelevamientosPreview();

  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [currentPage, setCurrentPage]   = useState(1);

  const filteredSurveys = useMemo(() => {
    const clean = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return data.filter((r) => {
      const texto = `${r.nombre} ${r.barrio} ${formatFecha(r.fecha)}`;
      const matchSearch = clean(texto).includes(clean(searchTerm));
      const matchStatus = statusFilter === 'Todos' || r.estado === statusFilter ||
        (statusFilter === 'Pendiente' && !r.estado);
      return matchSearch && matchStatus;
    });
  }, [data, searchTerm, statusFilter]);

  const totalPages      = Math.ceil(filteredSurveys.length / ITEMS_PER_PAGE) || 1;
  const safeCurrentPage = currentPage > totalPages ? 1 : currentPage;

  const displayed = useMemo(() => {
    const start = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
    return filteredSurveys.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSurveys, safeCurrentPage]);

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Alert severity="error">Error al cargar encuestas: {error}</Alert>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, width: '100%' }}>
      <SurveyFilters
        searchTerm={searchTerm}
        onSearchChange={(v) => { setSearchTerm(v); setCurrentPage(1); }}
        statusFilter={statusFilter}
        onStatusChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
      />

      <Grid container spacing={2.5}>
        {displayed.map((r) => (
          <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={r._id}>
            <SurveyCard
              id={r._id}
              title={r.nombre}
              description={`${r.barrio || 'sin barrio'} · ${formatFecha(r.fecha)}`}
              priority={r.prioridad}
              status={
                r.estado === 'Revisado' ? 'Revisado' :
                r.estado === 'Rechazado' ? 'Rechazado' :
                'Pendiente'
              }
            />
          </Grid>
        ))}
      </Grid>

      {displayed.length === 0 && (
        <Box sx={{ width: '100%', py: 8, display: 'flex', justifyContent: 'center' }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            No se encontraron encuestas que coincidan.
          </Typography>
        </Box>
      )}

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