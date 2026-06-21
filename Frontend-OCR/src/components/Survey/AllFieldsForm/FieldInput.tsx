// src/components/Survey/AllFieldsForm/FieldInput.tsx
import React from 'react';
import { Box, TextField, Switch, FormControlLabel, Chip, Typography } from '@mui/material';
import { getFieldLabel } from '../../../config/fieldLabels';
import { detectType, hasValue, toBool, emptyFieldSx, YELLOW, YELLOW_BORDER } from './fieldTypeUtils';

interface FieldInputProps {
  fieldKey:   string;
  value:      any;
  schemaType: string | undefined;
  onChange:   (key: string, value: any) => void;
}

const FieldInput: React.FC<FieldInputProps> = ({ fieldKey, value, schemaType, onChange }) => {
  const type    = detectType(fieldKey, value, schemaType);
  const isEmpty = !hasValue(value);
  const label   = getFieldLabel(fieldKey);

  if (type === 'dudas') {
    const items: string[] = Array.isArray(value) ? value : [];
    return (
      <Box sx={{
        px: 1.5, py: 1, borderRadius: 1,
        border: '1px solid', borderColor: isEmpty ? YELLOW_BORDER : 'divider',
        bgcolor: isEmpty ? YELLOW : undefined,
      }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.75 }}>
          {label}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, minHeight: 28 }}>
          {items.length === 0 ? (
            <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
              Sin dudas registradas
            </Typography>
          ) : (
            items.map((item) => (
              <Chip key={item} label={item} size="small" variant="outlined" color="warning"
                sx={{ fontSize: '11px' }} />
            ))
          )}
        </Box>
      </Box>
    );
  }

  if (type === 'boolean') {
    return (
      <Box sx={{
        px: 1.5, py: 0.75, borderRadius: 1,
        border: '1px solid', borderColor: isEmpty ? YELLOW_BORDER : 'divider',
        bgcolor: isEmpty ? YELLOW : undefined,
      }}>
        <FormControlLabel
          control={
            <Switch
              checked={toBool(value)}
              onChange={(e) => onChange(fieldKey, e.target.checked)}
              size="small"
            />
          }
          label={<Typography variant="body2">{label}</Typography>}
          sx={{ ml: 0, width: '100%' }}
        />
      </Box>
    );
  }

  if (type === 'number') {
    return (
      <TextField
        label={label}
        type="number"
        value={value ?? ''}
        onChange={(e) => onChange(fieldKey, e.target.value === '' ? null : Number(e.target.value))}
        fullWidth size="small"
        slotProps={{ inputLabel: { shrink: true } }}
        sx={emptyFieldSx(isEmpty)}
      />
    );
  }

  if (type === 'longtext') {
    return (
      <TextField
        label={label}
        value={value ?? ''}
        onChange={(e) => onChange(fieldKey, e.target.value)}
        fullWidth size="small" multiline minRows={3} maxRows={8}
        slotProps={{ inputLabel: { shrink: true } }}
        sx={emptyFieldSx(isEmpty)}
      />
    );
  }

  return (
    <TextField
      label={label}
      value={value ?? ''}
      onChange={(e) => onChange(fieldKey, e.target.value)}
      fullWidth size="small"
      slotProps={{ inputLabel: { shrink: true } }}
      sx={emptyFieldSx(isEmpty)}
    />
  );
};

export default FieldInput;