// src/components/Survey/SurveyList.tsx
import { useState, useMemo } from 'react';
import { Grid, Box, Typography, CircularProgress, Alert } from '@mui/material';
import { SurveyCard } from './SurveyCard';
import SurveyFilters from './SurveyFilter';
import SurveyPagination from './SurveyPagination';
import { useRelevamientos } from '../../hooks/useRelevamientos';
import { formatFecha} from '../../services/airTableService';

const ITEMS_PER_PAGE = 16;

const SurveyList = () => {
  const { data, loading, error } = useRelevamientos();

  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [currentPage, setCurrentPage]   = useState(1);

  const filteredSurveys = useMemo(() => {
    const clean = (s: string) =>
      s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    return data.filter((r) => {
      const texto = `${r.json_completo?.p1_familia ?? ''} ${r.direccion ?? ''} ${r.barrio_zona ?? ''} ${r.fecha_de_carga ?? ''} ${formatFecha(r.fecha_de_carga)}`;
      const matchSearch = clean(texto).includes(clean(searchTerm));
      // Por ahora todos son "Pendiente" hasta que implementemos estado de revisión
      const matchStatus = statusFilter === 'Todos' || statusFilter === 'Pendiente';
      return matchSearch && matchStatus;
    });
  }, [data, searchTerm, statusFilter]);

  const totalPages     = Math.ceil(filteredSurveys.length / ITEMS_PER_PAGE) || 1;
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
              id={r._id}             // ← ahora es el ID real de Airtable
              title={
                  r.json_completo?.p1_familia?.trim() || 
                  r.json_completo?.p4_familia?.trim() || 
                  'Sin nombre'
                }
              description={`${r.barrio_zona ?? 'sin barrio'} · ${formatFecha(r.fecha_de_carga) ?? 'sin fecha de carga'}`}
              status="Pendiente"
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