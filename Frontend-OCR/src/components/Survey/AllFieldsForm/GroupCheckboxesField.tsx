// src/components/Survey/AllFieldsForm/GroupCheckboxesField.tsx
import React from 'react';
import { Box, FormGroup, FormControlLabel, Checkbox, TextField, Typography } from '@mui/material';
import { type FieldGroup, getMultiGroupValues } from '../../../config/fieldGroups';
import { toBool, YELLOW, YELLOW_BORDER } from './fieldTypeUtils';

interface GroupCheckboxesFieldProps {
  group:    FieldGroup;
  campos:   Record<string, any>;
  onChange: (key: string, value: any) => void;
}

const GroupCheckboxesField: React.FC<GroupCheckboxesFieldProps> = ({ group, campos, onChange }) => {
  const selected = getMultiGroupValues(group, campos);
  const isEmpty  = selected.length === 0;

  return (
    <Box sx={{
      px: 1.5, py: 1, borderRadius: 1,
      border: '1px solid', borderColor: isEmpty ? YELLOW_BORDER : 'divider',
      bgcolor: isEmpty ? YELLOW : undefined,
    }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
        {group.label}
      </Typography>
      <FormGroup row sx={{ gap: 0 }}>
        {group.options.map((opt) => (
          <FormControlLabel
            key={opt.key}
            sx={{ width: { xs: '100%', sm: '50%' }, ml: 0 }}
            control={
              <Checkbox
                size="small"
                checked={toBool(campos[opt.key])}
                onChange={(e) => onChange(opt.key, e.target.checked)}
              />
            }
            label={<Typography variant="body2">{opt.label}</Typography>}
          />
        ))}
        </FormGroup>

        {group.otherTextKey && (
        <TextField
            label={`${group.label} — detalle`}
            value={campos[group.otherTextKey] ?? ''}
            onChange={(e) => onChange(group.otherTextKey!, e.target.value)}
            fullWidth size="small" sx={{ mt: 1 }}
            slotProps={{ inputLabel: { shrink: true } }}
        />
        )}
    </Box>
  );
};

export default GroupCheckboxesField;