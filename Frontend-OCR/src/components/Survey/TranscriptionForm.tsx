import React from 'react';
import { 
  Box, 
  Card, 
  Typography, 
  TextField, 
  Button, 
  Divider 
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SaveIcon from '@mui/icons-material/Save';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

export interface TranscriptionFormData {
  barrio: string;
  fecha: string;
  propietario: string;
  antiguedad: string;
  electricidad: string;
  inundable: string;
  espacioConstruir: string;
  eliminacionTipo: string;
  eliminacionProfundidad: string;
  eliminacionCalzado: string;
}

export interface TranscriptionFormProps {
  formData: TranscriptionFormData;
  onInputChange: (field: keyof TranscriptionFormData, value: string) => void;
  onApprove: () => void;
  onSaveDraft: () => void;
  onReject: () => void;
}

export const TranscriptionForm: React.FC<TranscriptionFormProps> = ({
  formData,
  onInputChange,
  onApprove,
  onSaveDraft,
  onReject
}) => {
  return (
    <Card 
      sx={{ 
        boxShadow: 1, 
        border: 1,
        borderColor: 'divider',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        height: { xs: 'auto', lg: '100%' },
        minHeight: 0,
        overflow: 'hidden'
      }}
    >
      {/* Cabecera del panel de transcripción */}
      <Box sx={{ p: 3, pb: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 700, color: 'text.primary', fontSize: '20px' }}>
          Transcripción de encuesta
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Revisá los campos completados por IA y corregí los que sean necesarios
        </Typography>
      </Box>

      {/* Scrollable inputs wrapper */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, display: 'flex', flexDirection: 'column', gap: 3.5 }}>
        {/* SECTION: Datos del terreno */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '12px' }}>
            Datos del terreno
          </Typography>
          
          {/* Barrio */}
          <TextField 
            label="Barrio / Zona" 
            value={formData.barrio} 
            onChange={(e) => onInputChange('barrio', e.target.value)}
            fullWidth
            size="small"
          />

          {/* Fecha */}
          <TextField 
            label="Fecha" 
            value={formData.fecha} 
            onChange={(e) => onInputChange('fecha', e.target.value)}
            fullWidth
            size="small"
          />

          {/* Propietario (Alerta IA - Baja confianza) */}
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 1, 
              bgcolor: '#FFFDE7', 
              border: '1px solid #FFE082',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main' }}>
              <WarningAmberIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '13px' }}>
                ¿De quién es el terreno? (Baja confianza)
              </Typography>
            </Box>
            <TextField 
              value={formData.propietario} 
              onChange={(e) => onInputChange('propietario', e.target.value)}
              fullWidth
              size="small"
              sx={{ bgcolor: '#FFFFFF' }}
            />
          </Box>

          {/* Antiguedad */}
          <TextField 
            label="¿Hace cuánto viven?" 
            value={formData.antiguedad} 
            onChange={(e) => onInputChange('antiguedad', e.target.value)}
            fullWidth
            size="small"
          />

          {/* Electricidad */}
          <TextField 
            label="¿Tienen electricidad?" 
            value={formData.electricidad} 
            onChange={(e) => onInputChange('electricidad', e.target.value)}
            fullWidth
            size="small"
          />

          {/* Terreno Inundable (Alerta IA - Baja confianza) */}
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 1, 
              bgcolor: '#FFFDE7', 
              border: '1px solid #FFE082',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main' }}>
              <WarningAmberIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '13px' }}>
                ¿Terreno inundable? (Baja confianza)
              </Typography>
            </Box>
            <TextField 
              value={formData.inundable} 
              onChange={(e) => onInputChange('inundable', e.target.value)}
              fullWidth
              size="small"
              sx={{ bgcolor: '#FFFFFF' }}
            />
          </Box>

          {/* Espacio para construir */}
          <TextField 
            label="¿Espacio para construir?" 
            value={formData.espacioConstruir} 
            onChange={(e) => onInputChange('espacioConstruir', e.target.value)}
            fullWidth
            size="small"
          />
        </Box>

        <Divider />

        {/* SECTION: Eliminación sanitaria */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary', letterSpacing: '0.5px', textTransform: 'uppercase', fontSize: '12px' }}>
            Eliminación sanitaria
          </Typography>

          {/* Tipo de eliminación */}
          <TextField 
            label="Tipo" 
            value={formData.eliminacionTipo} 
            onChange={(e) => onInputChange('eliminacionTipo', e.target.value)}
            fullWidth
            size="small"
          />

          {/* Profundidad (Alerta IA - Baja confianza) */}
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 1, 
              bgcolor: '#FFFDE7', 
              border: '1px solid #FFE082',
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'warning.main' }}>
              <WarningAmberIcon fontSize="small" />
              <Typography variant="body2" sx={{ fontWeight: 700, fontSize: '13px' }}>
                Profundidad (Baja confianza)
              </Typography>
            </Box>
            <TextField 
              value={formData.eliminacionProfundidad} 
              onChange={(e) => onInputChange('eliminacionProfundidad', e.target.value)}
              fullWidth
              size="small"
              sx={{ bgcolor: '#FFFFFF' }}
            />
          </Box>

          {/* Calzado */}
          <TextField 
            label="¿Está calzado?" 
            value={formData.eliminacionCalzado} 
            onChange={(e) => onInputChange('eliminacionCalzado', e.target.value)}
            fullWidth
            size="small"
          />
        </Box>
      </Box>

      {/* Acciones del Formulario */}
      <Box 
        sx={{ 
          p: 3, 
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          bgcolor: '#FFFFFF'
        }}
      >
        <Button 
          variant="contained" 
          color="success" 
          startIcon={<CheckCircleIcon />}
          onClick={onApprove}
          sx={{ 
            flexGrow: 1, 
            fontWeight: 700,
            color: '#FFF',
            py: 1.25,
            borderRadius: 1
          }}
        >
          Guardar y Aprobar
        </Button>

        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<SaveIcon />}
          onClick={onSaveDraft}
          sx={{ 
            fontWeight: 600,
            py: 1.25,
            borderRadius: 1
          }}
        >
          Guardar Borrador
        </Button>

        <Button 
          variant="outlined" 
          color="error" 
          startIcon={<CancelIcon />}
          onClick={onReject}
          sx={{ 
            fontWeight: 600,
            py: 1.25,
            borderRadius: 1
          }}
        >
          Rechazar
        </Button>
      </Box>
    </Card>
  );
};

export default TranscriptionForm;
