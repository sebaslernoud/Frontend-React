import React from 'react';
import { Box, Typography } from '@mui/material';

export const SettingsPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h1">
        Configuracion
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Contenido de la sección Configuracion.
      </Typography>
    </Box>
  );
};

export default SettingsPage;
