// src/components/Survey/SurveyCard.tsx
import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

interface SurveyCardProps {
  id: string;
  title: string;
  description: string;
  status: 'Pendiente' | 'Revisado' | 'Rechazado';
  priority?: string | null;
}

const PRIORITY_COLOR: Record<string, 'error' | 'warning' | 'success'> = {
  alta:  'error',
  media: 'warning',
  baja:  'success',
};

export const SurveyCard: React.FC<SurveyCardProps> = ({ id, title, description, status, priority }) => {
  const priorityKey = priority?.toLowerCase() ?? '';

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 2.5,
        boxShadow: 2,
        border: 1,
        borderColor: 'divider',
        borderRadius: '12px',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 4,
        }
      }}
    >
      <CardContent sx={{ p: 0, display: 'flex', flexDirection: 'column', gap: 1.5, flexGrow: 1, '&:last-child': { pb: 0 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '18px' }}>
            {title}
          </Typography>
          <Chip
            label={status}
            color={status === 'Revisado' ? 'success' : status === 'Rechazado' ? 'error' : 'warning'}
            size="small"
            sx={{ fontWeight: 600, fontSize: '12px', color: '#FFFFFF' }}
          />
        </Box>

        {priority && (
          <Chip
            label={`Prioridad: ${priority}`}
            color={PRIORITY_COLOR[priorityKey] ?? 'default'}
            size="small"
            variant="outlined"
            sx={{ alignSelf: 'flex-start', fontWeight: 600, fontSize: '11px' }}
          />
        )}

        <Typography variant="body2" sx={{ color: 'text.secondary', flexGrow: 1 }}>
          {description}
        </Typography>

        <Button
          component={Link}
          to={`/encuestas/revisar/${id}`}
          variant="contained"
          size="medium"
          sx={{ alignSelf: 'flex-start', px: 2, py: 0.75 }}
        >
          Revisar
        </Button>
      </CardContent>
    </Card>
  );
};