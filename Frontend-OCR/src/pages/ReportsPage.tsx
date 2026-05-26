import React from 'react';
import { Box, Typography } from '@mui/material';

export const ReportsPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h1">
        Reportes
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Contenido de la sección Reportes.
      </Typography>
    </Box>
  );
};

export default ReportsPage;
