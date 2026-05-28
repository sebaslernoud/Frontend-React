// import React, { useState, useMemo } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import { 
//   Box, 
//   Grid, 
//   Typography, 
//   Button, 
//   Snackbar,
//   Alert
// } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// import scannedFormImg from '../assets/ejemplo_formulario.png';
// import SurveySummaryCard from '../components/Survey/SurveySummaryCard';
// import DocumentViewer from '../components/Survey/DocumentViewer';
// import TranscriptionForm, { type TranscriptionFormData } from '../components/Survey/TranscriptionForm';

// export const ReviewSurveyPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();

//   // Estados interactivos
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'error'>('success');

//   // Estado del formulario
//   const [formData, setFormData] = useState<TranscriptionFormData>({
//     barrio: 'Los Ceibos',
//     fecha: '12/05/2026',
//     propietario: 'Propio (boleto de compraventa)',
//     antiguedad: '10 años',
//     electricidad: 'Sí, conexión formal con medidor',
//     inundable: 'No, nunca se ha inundado',
//     espacioConstruir: 'Sí, libre al fondo (aprox 6x4m)',
//     eliminacionTipo: 'Pozo ciego con cámara séptica',
//     eliminacionProfundidad: '1.80 metros',
//     eliminacionCalzado: 'Sí, calzado completo con ladrillo',
//   });

//   // Mock de familias consistente con SurveyList
//   const familyName = useMemo(() => {
//     const families = [
//       'García', 'Rodríguez', 'Pérez', 'López', 
//       'Martínez', 'Fernández', 'González', 'Sánchez', 
//       'Díaz', 'Torres', 'Ramírez', 'Flores', 
//       'Acosta', 'Benítez', 'Castro', 'Ruiz'
//     ];
//     const index = Number(id) ? Number(id) - 1 : 0;
//     return families[index % families.length] || 'García';
//   }, [id]);

//   const handleInputChange = (field: keyof TranscriptionFormData, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSaveDraft = () => {
//     setToastSeverity('info');
//     setToastMessage('Borrador guardado correctamente');
//     setShowToast(true);
//     setTimeout(() => {
//       navigate('/encuestas');
//     }, 1500);
//   };

//   const handleApprove = () => {
//     setToastSeverity('success');
//     setToastMessage('Encuesta revisada y aprobada con éxito');
//     setShowToast(true);
//     setTimeout(() => {
//       navigate('/encuestas');
//     }, 1500);
//   };

//   const handleReject = () => {
//     setToastSeverity('error');
//     setToastMessage('Encuesta rechazada');
//     setShowToast(true);
//     setTimeout(() => {
//       navigate('/encuestas');
//     }, 1500);
//   };

//   return (
//     <Box 
//       sx={{ 
//         width: '100%', 
//         height: { xs: 'auto', lg: 'calc(100vh - 134px)' }, 
//         maxHeight: { xs: 'none', lg: 'calc(100vh - 134px)' }, 
//         display: 'flex', 
//         flexDirection: 'column', 
//         gap: 2, 
//         overflow: { xs: 'visible', lg: 'hidden' } 
//       }}
//     >
//       {/* Botón superior de retroceso */}
//       <Box>
//         <Button 
//           startIcon={<ArrowBackIcon />} 
//           onClick={() => navigate('/encuestas')}
//           sx={{ 
//             color: 'text.secondary', 
//             fontWeight: 600,
//             textTransform: 'none',
//             '&:hover': { color: 'primary.main' }
//           }}
//         >
//           Volver a Encuestas pendientes
//         </Button>
//       </Box>

//       {/* Título Principal */}
//       <Typography 
//         variant="h4" 
//         component="h1" 
//         sx={{ 
//           fontWeight: 700, 
//           fontSize: { xs: '22px', sm: '28px' },
//           color: 'text.primary',
//           mt: -0.5
//         }}
//       >
//         Encuesta Baño de Emergencia — Familia {familyName}
//       </Typography>

//       <Grid container spacing={3.5} sx={{ flexGrow: 1, minHeight: 0, height: { xs: 'auto', lg: '100%' }, overflow: { xs: 'visible', lg: 'hidden' }, mb: 1 }}>
//         {/* COLUMNA IZQUIERDA: Vista del documento escaneado */}
//         <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: { xs: 'auto', lg: '100%' }, overflow: { xs: 'visible', lg: 'hidden' } }}>
//           {/* Tarjeta de Resumen */}
//           <SurveySummaryCard />

//           {/* Visualizador de Formulario Escaneado */}
//           <DocumentViewer 
//             imageUrl={scannedFormImg}
//             altText="Formulario Escaneado"
//           />
//         </Grid>

//         {/* COLUMNA DERECHA: Formulario de transcripción */}
//         <Grid size={{ xs: 12, lg: 6 }} sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: { xs: 'auto', lg: '100%' }, overflow: { xs: 'visible', lg: 'hidden' } }}>
//           <TranscriptionForm 
//             formData={formData}
//             onInputChange={handleInputChange}
//             onApprove={handleApprove}
//             onSaveDraft={handleSaveDraft}
//             onReject={handleReject}
//           />
//         </Grid>
//       </Grid>

//       {/* Snackbar feedback toasts */}
//       <Snackbar 
//         open={showToast} 
//         autoHideDuration={1500} 
//         onClose={() => setShowToast(false)}
//         anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
//       >
//         <Alert 
//           onClose={() => setShowToast(false)} 
//           severity={toastSeverity} 
//           sx={{ width: '100%', fontWeight: 600 }}
//         >
//           {toastMessage}
//         </Alert>
//       </Snackbar>
//     </Box>
//   );
// };

// export default ReviewSurveyPage;
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
import TranscriptionForm, { type TranscriptionFormData } from '../components/Survey/TranscriptionForm';
import { useRelevamientoById } from '../hooks/useRelevamientos';

export const ReviewSurveyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, loading, error } = useRelevamientoById(id ?? '');

  const [showToast, setShowToast]       = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastSeverity, setToastSeverity] = useState<'success' | 'info' | 'error'>('success');

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
    setTimeout(() => navigate('/encuestas'), 1500);
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
          <SurveySummaryCard priority={prioridad} />
          <DocumentViewer imageUrl={scannedFormImg} altText="Formulario Escaneado" />
        </Grid>

        <Grid size={{ xs: 12, lg: 6 }} sx={{
          display: 'flex', flexDirection: 'column', gap: 2,
          height: { xs: 'auto', lg: '100%' },
          overflow: { xs: 'visible', lg: 'hidden' }
        }}>
          <TranscriptionForm
            formData={formData}
            onInputChange={handleInputChange}
            onApprove={() => showFeedback('Encuesta revisada y aprobada con éxito', 'success')}
            onSaveDraft={() => showFeedback('Borrador guardado correctamente', 'info')}
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