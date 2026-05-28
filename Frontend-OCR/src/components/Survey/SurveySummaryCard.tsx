import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

export interface SurveySummaryCardProps {
  priority?:        'ALTA' | 'MEDIA' | 'BAJA';
  eliminacion?:     string;
  fuenteAgua?:      string;
  accesoAgua?:      string;
  equipamiento?:    string[];
  terreno?:         string;
}

// Mapeos de claves técnicas a texto legible
const ELIMINACION_MAP: Record<string, string> = {
  biopozo:     'Biopozo',
  pozo_ciego:  'Pozo ciego',
  cloaca:      'Cloaca',
};

const FUENTE_AGUA_MAP: Record<string, string> = {
  corriente_irregular_enganchados: 'Corriente irregular',
  perforacion_con_bomba:           'Perforación con bomba',
  camion_cisterna:                 'Camión cisterna',
  pozo_a_balde:                    'Pozo a balde',
};

const ACCESO_MAP: Record<string, string> = {
  en_el_terreno:  'En el terreno',
  fuera_terreno:  'Fuera del terreno',
};

const TERRENO_MAP: Record<string, string> = {
  propio:    'Propio',
  alquilado: 'Alquilado',
  prestado:  'Prestado',
  fiscal:    'Fiscal',
};

export const SurveySummaryCard: React.FC<SurveySummaryCardProps> = ({
  priority     = 'ALTA',
  eliminacion  = '',
  fuenteAgua   = '',
  accesoAgua   = '',
  equipamiento = [],
  terreno      = '',
}) => {
  const eliminacionLabel  = ELIMINACION_MAP[eliminacion]  || eliminacion  || 'Sin datos';
  const fuenteAguaLabel   = FUENTE_AGUA_MAP[fuenteAgua]   || fuenteAgua   || 'Sin datos';
  const accesoAguaLabel   = ACCESO_MAP[accesoAgua]        || accesoAgua   || 'Sin datos';
  const terrenoLabel      = TERRENO_MAP[terreno]          || terreno      || 'Sin datos';
  const equipamientoLabel = equipamiento.length > 0 ? equipamiento.join(', ') : 'Sin datos';

  return (
    <Card sx={{ boxShadow: 1, border: 1, borderColor: 'divider', borderRadius: '12px', flexShrink: 0 }}>
      <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 1.5, '&:last-child': { pb: 3 } }}>
        <Typography variant="subtitle2" sx={{ color: 'primary.main', fontWeight: 700, letterSpacing: '0.5px' }}>
          ENCUESTA BAÑO DE EMERGENCIA
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
          Tabla: Nombre | Edad | Rol | Estudios | Enfermedades...
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, mt: 0.5 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            • <strong>Eliminación sanitaria:</strong> {eliminacionLabel}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            • <strong>Fuente de agua:</strong> {fuenteAguaLabel} — <strong>Acceso:</strong> {accesoAguaLabel}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            • <strong>Equipamiento:</strong> {equipamientoLabel}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: priority === 'ALTA' ? 'success.main' : 'warning.main' }}>
            • Terreno: {terrenoLabel} — Prioridad: {priority}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SurveySummaryCard;