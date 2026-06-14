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
import TranscriptionForm, { type TranscriptionFormData } from '../components/Survey/TranscriptionForm';
import AllFieldsForm from '../components/Survey/AllFieldsForm';
import { useRelevamientoById } from '../hooks/useRelevamientos';
import { updateRelevamiento } from '../services/airTableService';

// Maps each TranscriptionForm field to its Airtable campo key
const TRANSCRIPTION_TO_CAMPO: Record<keyof TranscriptionFormData, string> = {
  barrio:                 'p1_barrio_zona',
  fecha:                  'p1_fecha',
  propietario:            'p3_terreno_de_quien',
  antiguedad:             'p3_terreno_anios_viviendo',
  electricidad:           'p3_tienen_electricidad',
  inundable:              'p3_terreno_inundable',
  espacioConstruir:       'p3_terreno_espacio_construir',
  eliminacionTipo:        'p1_conexion_ms',
  eliminacionProfundidad: 'p3_pozo_profundidad',
  eliminacionCalzado:     'p3_pozo_esta_calzado',
};

function formatDateForDisplay(raw: any): string {
  if (!raw) return '';
  const d = new Date(String(raw));
  if (!isNaN(d.getTime())) return d.toLocaleDateString('es-AR');
  return String(raw);
}

function isBooleanTrue(v: any): boolean {
  return v === true || v === 'true';
}

export const ReviewSurveyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useRelevamientoById(id ?? '');

  const [showToast, setShowToast]         = useState(false);
  const [toastMessage, setToastMessage]   = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'error'>('success');
  const [saving, setSaving]               = useState(false);

  // Single source of truth for all campo values
  const [camposEditados, setCamposEditados] = useState<Record<string, any>>({});

  useEffect(() => {
    if (data) setCamposEditados({ ...data.campos });
  }, [data]);

  // formData for TranscriptionForm is derived from camposEditados (not its own state)
  const formData: TranscriptionFormData = {
    barrio:                 String(camposEditados.p1_barrio_zona ?? ''),
    fecha:                  formatDateForDisplay(camposEditados.p1_fecha) || formatDateForDisplay(data?.fecha),
    propietario:            String(camposEditados.p3_terreno_de_quien ?? ''),
    antiguedad:             String(camposEditados.p3_terreno_anios_viviendo ?? ''),
    electricidad:           String(camposEditados.p3_tienen_electricidad ?? ''),
    inundable:              String(camposEditados.p3_terreno_inundable ?? ''),
    espacioConstruir:       String(camposEditados.p3_terreno_espacio_construir ?? ''),
    eliminacionTipo:        String(camposEditados.p1_conexion_ms ?? ''),
    eliminacionProfundidad: String(camposEditados.p3_pozo_profundidad ?? ''),
    eliminacionCalzado:     String(camposEditados.p3_pozo_esta_calzado ?? ''),
  };

  // TranscriptionForm writes back to camposEditados, converting to original type where known
  const handleTranscriptionChange = (field: keyof TranscriptionFormData, value: string) => {
    const campoKey = TRANSCRIPTION_TO_CAMPO[field];
    const originalValue = data?.campos[campoKey];
    let converted: any = value;
    if (typeof originalValue === 'boolean') {
      converted = value.toLowerCase() === 'true' || value.toLowerCase() === 'si' || value.toLowerCase() === 'sí';
    } else if (typeof originalValue === 'number') {
      converted = value === '' ? null : Number(value);
    }
    setCamposEditados(prev => ({ ...prev, [campoKey]: converted }));
  };

  // AllFieldsForm writes directly to camposEditados
  const handleCampoChange = (key: string, value: any) => {
    setCamposEditados(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async (
    mensaje: string,
    severity: 'success' | 'info' | 'error',
    estado: string = 'Pendiente'
  ) => {
    if (!id || !data) return;
    setSaving(true);
    try {
      // Fields Airtable won't accept via PATCH (formula, auto-number, computed)
      const SKIP_ON_PATCH = new Set([
        'Fecha de carga',
        'Última modificación',
        'ID_relevamiento',
      ]);

      // Only send fields that actually changed — avoids hitting read-only formula fields
      const fields: Record<string, any> = {};
      for (const [k, v] of Object.entries(camposEditados)) {
        if (SKIP_ON_PATCH.has(k)) continue;
        if (JSON.stringify(v) !== JSON.stringify(data.campos[k])) {
          fields[k] = v;
        }
      }
      // Update the review-status column only if it actually exists in this table
      // (case-insensitive search because Airtable column names are case-sensitive)
      const estadoKey = Object.keys(data.campos).find(
        k => k.toLowerCase() === 'estado'
      );
      if (estadoKey) {
        fields[estadoKey] = estado;
      } else {
        console.warn('[Save] No se encontró columna de estado en data.campos. Claves disponibles:', Object.keys(data.campos));
      }

      console.log('[Save] campos modificados:', Object.keys(fields));
      await updateRelevamiento(data._id, fields);

      setToastMessage(mensaje);
      setToastSeverity(severity);
      setShowToast(true);
    } catch (err: any) {
      setToastMessage(`Error al guardar: ${err.message}`);
      setToastSeverity('error');
      setShowToast(true);
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

  const familyName = camposEditados['p1_familia'] || camposEditados['nombre_familia'] || data?.direccion || 'Sin nombre';
  const prioridad  = (
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
        color: 'text.primary', mt: -0.5
      }}>
        Encuesta Baño de Emergencia — Familia {familyName}
      </Typography>

      {/* Top section: SummaryCard + DocumentViewer | TranscriptionForm */}
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
              isBooleanTrue(camposEditados.p3_cuenta_inodoro)        ? 'Inodoro'   : '',
              isBooleanTrue(camposEditados.p3_cuenta_lavatorio)       ? 'Lavatorio' : '',
              isBooleanTrue(camposEditados.p3_cuenta_espacio_ducha)   ? 'Ducha'     : '',
              isBooleanTrue(camposEditados.p3_cuenta_canillas)        ? 'Canillas'  : '',
            ].filter(Boolean)}
          />
          <DocumentViewer imageUrl={scannedFormImg} altText="Formulario Escaneado" />
        </Grid>

        {/* <Grid size={{ xs: 12, lg: 6 }} sx={{
          display: 'flex', flexDirection: 'column', gap: 2,
          height: { xs: 'auto', lg: '100%' },
          overflow: { xs: 'visible', lg: 'hidden' },
        }}>
          <TranscriptionForm
            formData={formData}
            saving={saving}
            onInputChange={handleTranscriptionChange}
            onApprove={() => handleSave('Encuesta aprobada con éxito', 'success', 'Revisado')}
            onSaveDraft={() => handleSave('Borrador guardado correctamente', 'info')}
            onReject={() => handleSave('Encuesta rechazada', 'error', 'Rechazado')}
          />
        </Grid> */}
      </Grid>

      {/* Full-width editor for all 186 campos — below the main grid */}
      {Object.keys(camposEditados).length > 0 && (
        <AllFieldsForm
          campos={camposEditados}
          onChange={handleCampoChange}
          onSave={() => handleSave('Cambios guardados correctamente', 'success')}
          saving={saving}
        />
      )}

      <Snackbar
        open={showToast} autoHideDuration={1500}
        onClose={() => setShowToast(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setShowToast(false)} severity={toastSeverity}
          sx={{ width: '100%', fontWeight: 600 }}>
          {toastMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReviewSurveyPage;
