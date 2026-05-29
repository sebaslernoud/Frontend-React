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
import { useRelevamientoById } from '../hooks/useRelevamientos';
import { updateRelevamiento } from '../services/airTableService'
;
export const ReviewSurveyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useRelevamientoById(id ?? '');

  const [showToast, setShowToast]       = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'error'>('success');

  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState<TranscriptionFormData>({
    barrio:                '',
    fecha:                 '',
    propietario:           '',
    antiguedad:            '',
    electricidad:          '',
    inundable:             '',
    espacioConstruir:      '',
    eliminacionTipo:       '',
    eliminacionProfundidad:'',
    eliminacionCalzado:    '',
  });

  // Cuando llegan los datos de Airtable, pre-populamos el formulario
  useEffect(() => {
    if (!data) return;
    const j = data.json_completo;
    setFormData({
      barrio:                 data.barrio_zona ?? '',
      fecha:                  data.fecha ? new Date(data.fecha).toLocaleDateString('es-AR') : '',
      propietario:            j?.p3_terreno_de_quien ?? '',
      antiguedad:             j?.p3_terreno_anios_viviendo ?? '',
      electricidad:           j?.p3_tienen_electricidad ?? '',
      inundable:              j?.p3_terreno_inundable ?? '',
      espacioConstruir:       j?.p3_terreno_espacio_construir ?? '',
      eliminacionTipo:        j?.p1_conexion_ms ?? '',
      eliminacionProfundidad: j?.p3_pozo_profundidad ?? '',
      eliminacionCalzado:     j?.p3_pozo_esta_calzado ?? '',
    });
  }, [data]);

  const handleInputChange = (field: keyof TranscriptionFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const showFeedback = (msg: string, severity: 'success' | 'info' | 'error') => {
    setToastMessage(msg);
    setToastSeverity(severity);
    setShowToast(true);
    // setTimeout(() => navigate('/encuestas'), 1500);
  };

  const handleSave = async (mensaje: string, severity: 'success' | 'info' | 'error') => {
    if (!id || !data) return;
    setSaving(true);
    try {
      // Mezclamos el JSON original con los cambios del formulario
      const jsonActualizado = {
        ...data.json_completo,
        p1_barrio_zona:           formData.barrio,
        p1_conexion_ms:           formData.eliminacionTipo,
        p3_barrio_zona:           formData.barrio,
        p3_terreno_de_quien:      formData.propietario,
        p3_terreno_anios_viviendo: formData.antiguedad,
        p3_tienen_electricidad:   formData.electricidad,
        p3_terreno_inundable:     formData.inundable,
        p3_terreno_espacio_construir: formData.espacioConstruir,
        p3_pozo_profundidad:      formData.eliminacionProfundidad,
        p3_pozo_esta_calzado:     formData.eliminacionCalzado,
      };

      await updateRelevamiento(data._id, {
        'Barrio/Zona':    formData.barrio,
        'Prioridad':      prioridad.toLowerCase(),
        'JSON completo':  JSON.stringify(jsonActualizado),
      });

      setToastMessage(mensaje);
      setToastSeverity(severity);
      setShowToast(true);
      // setTimeout(() => navigate('/encuestas'), 1500);
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

  const familyName = data?.json_completo?.p1_familia || data?.direccion || 'Sin nombre';
  const prioridad  = (data?.prioridad?.toUpperCase() ?? 'ALTA') as 'ALTA' | 'MEDIA' | 'BAJA';

  return (
    <Box sx={{
      width: '100%',
      height: { xs: 'auto', lg: 'calc(100vh - 134px)' },
      maxHeight: { xs: 'none', lg: 'calc(100vh - 134px)' },
      display: 'flex', flexDirection: 'column', gap: 2,
      overflow: { xs: 'visible', lg: 'hidden' }
    }}>
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

      <Grid container spacing={3.5} sx={{
        flexGrow: 1, minHeight: 0,
        height: { xs: 'auto', lg: '100%' },
        overflow: { xs: 'visible', lg: 'hidden' }, mb: 1
      }}>
        <Grid size={{ xs: 12, lg: 6 }} sx={{
          display: 'flex', flexDirection: 'column', gap: 2,
          height: { xs: 'auto', lg: '100%' },
          overflow: { xs: 'visible', lg: 'hidden' }
        }}>
          <SurveySummaryCard
            priority={prioridad}
            eliminacion={data?.json_completo?.p1_conexion_ms ?? ''}
            fuenteAgua={data?.json_completo?.p3_fuente_agua ?? ''}
            accesoAgua={data?.json_completo?.p3_acceso_agua_cat ?? ''}
            terreno={data?.json_completo?.p3_terreno_de_quien ?? ''}
            equipamiento={[
              data?.json_completo?.p3_cuenta_inodoro    ? 'Inodoro'    : '',
              data?.json_completo?.p3_cuenta_lavatorio  ? 'Lavatorio'  : '',
              data?.json_completo?.p3_cuenta_espacio_ducha ? 'Ducha'   : '',
              data?.json_completo?.p3_cuenta_canillas   ? 'Canillas'   : '',
            ].filter(Boolean)}
          />
          <DocumentViewer imageUrl={scannedFormImg} altText="Formulario Escaneado" />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }} sx={{
          display: 'flex', flexDirection: 'column', gap: 2,
          height: { xs: 'auto', lg: '100%' },
          overflow: { xs: 'visible', lg: 'hidden' }
        }}>
          <TranscriptionForm
            formData={formData}
            saving={saving}
            onInputChange={handleInputChange}
            onApprove={() => handleSave('Encuesta aprobada con éxito', 'success')}
            onSaveDraft={() => handleSave('Borrador guardado correctamente', 'info')}
            onReject={() => showFeedback('Encuesta rechazada', 'error')}
            
          />
        </Grid>
      </Grid>

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