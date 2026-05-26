import React from 'react';
import { Box, Typography } from '@mui/material';
import SurveyList from '../components/Survey/SurveyList';

export const SurveysPage: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h1">
        Encuestas pendientes de revisión
      </Typography>
      <SurveyList />
    </Box>
  );
};

export default SurveysPage;
