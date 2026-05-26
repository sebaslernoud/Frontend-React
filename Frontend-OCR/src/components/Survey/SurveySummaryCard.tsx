import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export interface SurveySummaryCardProps {
  priority?: 'ALTA' | 'MEDIA' | 'BAJA';
}

export const SurveySummaryCard: React.FC<SurveySummaryCardProps> = ({ priority = 'ALTA' }) => {
  return (
    <Card 
      sx={{ 
        boxShadow: 1, 
        border: 1,
        borderColor: 'divider',
        borderRadius: '12px',
        flexShrink: 0
      }}
    >
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5, '&:last-child': { pb: 3 } }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: 'primary.main', 
            fontWeight: 700, 
            letterSpacing: '0.5px' 
          }}
        >
          ENCUESTA BAÑO DE EMERGENCIA
        </Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'text.secondary', 
            fontWeight: 600, 
          }}
        >
          Tabla: Nombre | Edad | Rol | Estudios | Enfermedades...
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            • <strong>Eliminación sanitaria:</strong> Pozo ciego
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            • <strong>Fuente de agua:</strong> Corriente irregular — <strong>Acceso:</strong> En el terreno
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            • <strong>Equipamiento:</strong> Inodoro, Ducha (sin lavatorio)
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: priority === 'ALTA' ? 'success.main' : 'warning.main' }}>
            • Terreno: Propio — Prioridad: {priority}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SurveySummaryCard;
