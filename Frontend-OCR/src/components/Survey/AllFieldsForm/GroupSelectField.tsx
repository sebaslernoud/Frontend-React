// src/components/Survey/AllFieldsForm/GroupSelectField.tsx
import React from 'react';
import { Box, TextField, MenuItem } from '@mui/material';
import { type FieldGroup, getSingleGroupValue } from '../../../config/fieldGroups';
import { YELLOW, YELLOW_BORDER } from './fieldTypeUtils';

interface GroupSelectFieldProps {
  group:    FieldGroup;
  campos:   Record<string, any>;
  onChange: (key: string, value: any) => void;
}

const GroupSelectField: React.FC<GroupSelectFieldProps> = ({ group, campos, onChange }) => {
  const selectedKey = getSingleGroupValue(group, campos);
  const isEmpty = selectedKey === null;

  const handleSelect = (newKey: string) => {
    for (const opt of group.options) {
      onChange(opt.key, opt.key === newKey);
    }
  };

  return (
    <Box sx={{
      px: 1.5, py: 1, borderRadius: 1,
      border: '1px solid', borderColor: isEmpty ? YELLOW_BORDER : 'divider',
      bgcolor: isEmpty ? YELLOW : undefined,
    }}>
    <TextField
        select
        label={group.label}
        value={selectedKey ?? ''}
        onChange={(e) => handleSelect(e.target.value)}
        fullWidth size="small"
        slotProps={{ inputLabel: { shrink: true } }}
        >
        <MenuItem value="">
            <em>Sin seleccionar</em>
        </MenuItem>
        {group.options.map((opt) => (
            <MenuItem key={opt.key} value={opt.key}>{opt.label}</MenuItem>
        ))}
        </TextField>

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

export default GroupSelectField;