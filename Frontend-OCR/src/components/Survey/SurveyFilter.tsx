import React from 'react';
import { Box, TextField, Select, MenuItem, FormControl, InputAdornment } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface SurveyFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
}

const SurveyFilters: React.FC<SurveyFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
}) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 2, 
        alignItems: 'center',
        flexWrap: 'wrap',
        mb: 2,
        width: '100%'
      }}
    >
      {/* Buscador */}
      <TextField
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Buscar familia o fecha..."
        size="small"
        sx={{ 
          flexGrow: 1,
          maxWidth: { xs: '100%', sm: 400 },
          backgroundColor: '#FFFFFF'
        }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Selector de Estado */}
      <FormControl 
        size="small" 
        sx={{ 
          minWidth: 160,
          '& .MuiOutlinedInput-root': {
            borderRadius: 1,
            backgroundColor: '#FFFFFF',
          }
        }}
      >
        <Select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as string)}
          displayEmpty
          sx={{
            fontSize: '14px',
            color: 'text.primary'
          }}
        >
          <MenuItem value="Todos" sx={{ fontSize: '14px' }}>Todos los estados</MenuItem>
          <MenuItem value="Pendiente" sx={{ fontSize: '14px' }}>Pendiente</MenuItem>
          <MenuItem value="Revisado" sx={{ fontSize: '14px' }}>Revisado</MenuItem>
          <MenuItem value="Rechazado" sx={{ fontSize: '14px' }}>Rechazado</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default SurveyFilters;