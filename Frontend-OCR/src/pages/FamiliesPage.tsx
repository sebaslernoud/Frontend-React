import React from 'react';
import { Box, Typography } from '@mui/material';

export const FamiliesPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h1">
        Familias
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Contenido de la sección Familias.
      </Typography>
    </Box>
  );
};

export default FamiliesPage;
