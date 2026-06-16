// src/pages/ReviewSurveyPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Grid, Typography, Button,
  Snackbar, Alert, CircularProgress
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import scannedFormImg from '../assets/ejemplo_formulario.png';
import SurveySummaryCard from '../components/Survey/SurveySummaryCard';
import DocumentViewer from '../components/Survey/DocumentViewer';
import AllFieldsForm from '../components/Survey/AllFieldsForm';
import { useRelevamientoById } from '../hooks/useRelevamientos';
import { updateRelevamiento } from '../services/airTableService';
import { saveSurveyToSheets } from '../services/googleSheetsService';

// Campos que Airtable rechaza en PATCH (fórmulas, autonúmeros, campos calculados)
const AIRTABLE_READONLY_FIELDS = new Set([
  'Fecha de carga',
  'Última modificación',
  'ID_relevamiento',
]);

function isBooleanTrue(v: any): boolean {
  return v === true || v === 'true';
}

export const ReviewSurveyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useRelevamientoById(id ?? '');

  const [camposEditados, setCamposEditados] = useState<Record<string, any>>({});
  const [saving, setSaving]               = useState(false);
  const [toastMessage, setToastMessage]   = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'error'>('success');
  const [showToast, setShowToast]         = useState(false);

  useEffect(() => {
    if (data) setCamposEditados({ ...data.campos });
  }, [data]);

  const showFeedback = (message: string, severity: 'success' | 'info' | 'error') => {
    setToastMessage(message);
    setToastSeverity(severity);
    setShowToast(true);
  };

  const handleCampoChange = (key: string, value: any) => {
    setCamposEditados(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!id || !data) return;
    setSaving(true);
    try {
      // Enviar todos los campos, filtrando solo los read-only de Airtable
      const fields: Record<string, any> = {};
      for (const [key, value] of Object.entries(camposEditados)) {
        if (!AIRTABLE_READONLY_FIELDS.has(key)) {
          fields[key] = value;
        }
      }

      // Guardar en Airtable
      await updateRelevamiento(data._id, fields);

      // Guardar en Google Sheets (p1+p2 → Inspeccion Tecnica, p3+p4 → Encuesta)
      await saveSurveyToSheets(camposEditados);

      showFeedback('Cambios guardados correctamente', 'success');
    } catch (err: any) {
      showFeedback(`Error al guardar: ${err.message}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
      <CircularProgress />
    </Box>
  );

  if (error) return (
    <Alert severity="error">Error al cargar la encuesta: {error}</Alert>
  );

  const familyName =
    camposEditados['p1_familia'] ||
    camposEditados['nombre_familia'] ||
    data?.direccion ||
    'Sin nombre';

  const prioridad = (
    (camposEditados['Prioridad'] ?? data?.prioridad ?? 'alta') as string
  ).toUpperCase() as 'ALTA' | 'MEDIA' | 'BAJA';

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>

      <Box>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/encuestas')}
          sx={{ color: 'text.secondary', fontWeight: 600, textTransform: 'none',
            '&:hover': { color: 'primary.main' } }}
        >
          Volver a Encuestas pendientes
        </Button>
      </Box>

      <Typography variant="h4" component="h1" sx={{
        fontWeight: 700, fontSize: { xs: '22px', sm: '28px' },
        color: 'text.primary', mt: -0.5,
      }}>
        Encuesta Baño de Emergencia — Familia {familyName}
      </Typography>

      <Grid container spacing={3.5} sx={{
        height: { xs: 'auto', lg: 'calc(100vh - 240px)' },
        overflow: { xs: 'visible', lg: 'hidden' },
        mb: 1,
      }}>
        <Grid size={{ xs: 12, lg: 12 }} sx={{
          display: 'flex', flexDirection: 'column', gap: 2,
          height: { xs: 'auto', lg: '100%' },
          overflow: { xs: 'visible', lg: 'hidden' },
        }}>
          <SurveySummaryCard
            priority={prioridad}
            eliminacion={String(camposEditados.p1_conexion_ms ?? '')}
            fuenteAgua={String(camposEditados.p3_fuente_agua ?? '')}
            accesoAgua={String(camposEditados.p3_acceso_agua_cat ?? '')}
            terreno={String(camposEditados.p3_terreno_de_quien ?? '')}
            equipamiento={[
              isBooleanTrue(camposEditados.p3_cuenta_inodoro)      ? 'Inodoro'   : '',
              isBooleanTrue(camposEditados.p3_cuenta_lavatorio)     ? 'Lavatorio' : '',
              isBooleanTrue(camposEditados.p3_cuenta_espacio_ducha) ? 'Ducha'     : '',
              isBooleanTrue(camposEditados.p3_cuenta_canillas)      ? 'Canillas'  : '',
            ].filter(Boolean)}
          />
          <DocumentViewer imageUrl={scannedFormImg} altText="Formulario Escaneado" />
        </Grid>
      </Grid>

      {Object.keys(camposEditados).length > 0 && (
        <AllFieldsForm
          campos={camposEditados}
          onChange={handleCampoChange}
          onSave={handleSave}
          saving={saving}
        />
      )}

      <Snackbar
        open={showToast}
        autoHideDuration={1500}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setShowToast(false)}
          severity={toastSeverity}
          sx={{ width: '100%', fontWeight: 600 }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default ReviewSurveyPage;