// src/components/Survey/AllFieldsForm.tsx
import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Tabs, Tab, Grid,
  TextField, Switch, FormControlLabel, MenuItem,
  Chip, Typography, Button, Checkbox, FormGroup,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { getSchemaFields } from '../../services/airTableService';
import {
  FIELD_GROUPS, GROUPED_FIELD_KEYS,
  getSingleGroupValue, getMultiGroupValues,
  type FieldGroup,
} from '../../config/fieldGroups';
import { getFieldLabel } from '../../config/fieldLabels';

export interface AllFieldsFormProps {
  campos: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onSave: () => void;
  saving?: boolean;
}

type FieldType = 'boolean' | 'number' | 'longtext' | 'dudas' | 'text';
type Group = 'p1' | 'p2' | 'p3' | 'p4' | 'otros';

const AT_BOOL    = new Set(['checkbox']);
const AT_NUMBER  = new Set(['number', 'currency', 'percent', 'rating', 'duration', 'autoNumber', 'count']);
const AT_LONG    = new Set(['multilineText', 'richText']);

const LONG_TEXT_FIELDS = new Set([
  'p2_plano_terreno_descripcion',
  'p3_integrantes_texto_crudo',
  '_observaciones',
  'p3_comentarios',
  'p4_vivienda_observaciones',
]);

const TAB_LABELS: Record<Group, string> = {
  p1:    'Formulario 1',
  p2:    'Formulario 2',
  p3:    'Formulario 3',
  p4:    'Formulario 4',
  otros: 'General',
};

const GROUPS: Group[] = ['p1', 'p2', 'p3', 'p4', 'otros'];

function getGroup(key: string): Group {
  if (/^p1_/.test(key)) return 'p1';
  if (/^p2_/.test(key)) return 'p2';
  if (/^p3_/.test(key)) return 'p3';
  if (/^p4_/.test(key)) return 'p4';
  return 'otros';
}

function detectType(key: string, value: any, schemaType?: string): FieldType {
  if (key === '_dudas') return 'dudas';
  if (LONG_TEXT_FIELDS.has(key)) return 'longtext';
  if (schemaType) {
    if (AT_BOOL.has(schemaType))   return 'boolean';
    if (AT_NUMBER.has(schemaType)) return 'number';
    if (AT_LONG.has(schemaType))   return 'longtext';
  }
  if (typeof value === 'boolean')                                               return 'boolean';
  if (value === 'true' || value === 'false')                                    return 'boolean';
  if (typeof value === 'number')                                                return 'number';
  if (typeof value === 'string' && value.trim() !== '' && !isNaN(Number(value))) return 'number';
  if (typeof value === 'string' && value.length > 80)                          return 'longtext';
  return 'text';
}

function hasValue(value: any): boolean {
  if (value === null || value === undefined || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function toBool(value: any): boolean {
  if (typeof value === 'boolean') return value;
  return value === 'true' || value === '1';
}

const YELLOW = '#FFFDE7';
const YELLOW_BORDER = '#FFE082';

// ─── Grupo: selección única (dropdown) ─────────────────────────────────────
interface GroupSelectProps {
  group:    FieldGroup;
  campos:   Record<string, any>;
  onChange: (key: string, value: any) => void;
}

const GroupSelectField: React.FC<GroupSelectProps> = ({ group, campos, onChange }) => {
  const selectedKey = getSingleGroupValue(group, campos);
  const isEmpty = selectedKey === null;

  const handleSelect = (newKey: string) => {
    // Activa la opción elegida y desactiva el resto del grupo
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
        InputLabelProps={{ shrink: true }}
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
          InputLabelProps={{ shrink: true }}
        />
      )}
    </Box>
  );
};

// ─── Grupo: selección múltiple (checkboxes) ────────────────────────────────
const GroupCheckboxesField: React.FC<GroupSelectProps> = ({ group, campos, onChange }) => {
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
          InputLabelProps={{ shrink: true }}
        />
      )}
    </Box>
  );
};

// ─── Field input (campos sueltos, sin grupo) ───────────────────────────────
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

  const inputSx = isEmpty
    ? { '& .MuiOutlinedInput-root': { bgcolor: YELLOW } }
    : {};

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
        InputLabelProps={{ shrink: true }}
        sx={inputSx}
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
        InputLabelProps={{ shrink: true }}
        sx={inputSx}
      />
    );
  }

  return (
    <TextField
      label={label}
      value={value ?? ''}
      onChange={(e) => onChange(fieldKey, e.target.value)}
      fullWidth size="small"
      InputLabelProps={{ shrink: true }}
      sx={inputSx}
    />
  );
};

// ─── Main component ───────────────────────────────────────────────────────
const AllFieldsForm: React.FC<AllFieldsFormProps> = ({ campos, onChange, onSave, saving = false }) => {
  const [activeTab, setActiveTab] = useState(0);

  const schemaTypeMap = useMemo(() => {
    return new Map(getSchemaFields().map(f => [f.name, f.type]));
  }, []);

  // Campos sueltos = todos los del schema/campos MENOS los que ya están en algún grupo
  const looseKeys = useMemo(() => {
    const set = new Set([
      ...getSchemaFields().map(f => f.name),
      ...Object.keys(campos),
    ]);
    return Array.from(set).filter(k => !GROUPED_FIELD_KEYS.has(k));
  }, [campos]);

  const groupedLoose = useMemo(() => {
    const groups: Record<Group, string[]> = { p1: [], p2: [], p3: [], p4: [], otros: [] };
    for (const key of looseKeys) groups[getGroup(key)].push(key);
    for (const g of GROUPS) groups[g].sort();
    return groups;
  }, [looseKeys]);

  // Agrupar los fieldGroups (preguntas) por formulario, según el prefijo de su primera opción
  const groupedFieldGroups = useMemo(() => {
    const groups: Record<Group, FieldGroup[]> = { p1: [], p2: [], p3: [], p4: [], otros: [] };
    for (const fg of FIELD_GROUPS) {
      const firstKey = fg.options[0]?.key ?? '';
      groups[getGroup(firstKey)].push(fg);
    }
    return groups;
  }, []);

  // Completion counts: cuentan tanto fieldGroups (1 grupo = 1 "campo") como sueltos
  const completionCounts = useMemo(() => {
    const counts: Record<Group, { filled: number; total: number }> = {
      p1: { filled: 0, total: 0 }, p2: { filled: 0, total: 0 },
      p3: { filled: 0, total: 0 }, p4: { filled: 0, total: 0 },
      otros: { filled: 0, total: 0 },
    };
    for (const key of looseKeys) {
      const g = getGroup(key);
      counts[g].total++;
      if (hasValue(campos[key])) counts[g].filled++;
    }
    for (const g of GROUPS) {
      for (const fg of groupedFieldGroups[g]) {
        counts[g].total++;
        const filled = fg.type === 'single'
          ? getSingleGroupValue(fg, campos) !== null
          : getMultiGroupValues(fg, campos).length > 0;
        if (filled) counts[g].filled++;
      }
    }
    return counts;
  }, [looseKeys, campos, groupedFieldGroups]);

  return (
    <Card sx={{ boxShadow: 1, border: 1, borderColor: 'divider', borderRadius: '12px' }}>
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>

        <Box sx={{
          p: 3, pb: 2, borderBottom: 1, borderColor: 'divider',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2,
        }}>
          <Box>
            <Typography variant="h5" component="h2"
              sx={{ fontWeight: 700, color: 'text.primary', fontSize: '20px' }}>
              Todos los campos
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
              {looseKeys.length + FIELD_GROUPS.length} campos — edición completa del relevamiento
            </Typography>
          </Box>
          <Button
            variant="contained" color="primary" startIcon={<SaveIcon />}
            onClick={onSave} disabled={saving}
            sx={{ fontWeight: 700, py: 1.25, borderRadius: 1, whiteSpace: 'nowrap' }}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
          <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}
            variant="scrollable" scrollButtons="auto">
            {GROUPS.map((g, i) => {
              const { filled, total } = completionCounts[g];
              return (
                <Tab
                  key={g}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                      <span>{TAB_LABELS[g]}</span>
                      {total > 0 && (
                        <Chip
                          label={`${filled}/${total}`}
                          size="small"
                          color={filled === total ? 'success' : 'default'}
                          sx={{ height: 18, fontSize: '10px', '& .MuiChip-label': { px: 0.75 } }}
                        />
                      )}
                    </Box>
                  }
                  id={`allfields-tab-${i}`}
                  aria-controls={`allfields-tabpanel-${i}`}
                />
              );
            })}
          </Tabs>
        </Box>

        {GROUPS.map((g, i) =>
          activeTab !== i ? null : (
            <Box key={g} role="tabpanel" id={`allfields-tabpanel-${i}`}
              aria-labelledby={`allfields-tab-${i}`} sx={{ p: 3 }}>

              {groupedFieldGroups[g].length === 0 && groupedLoose[g].length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  Sin campos en este formulario.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {/* Preguntas agrupadas (dropdowns / checkboxes) primero */}
                  {groupedFieldGroups[g].map((fg) => (
                    <Grid key={fg.groupKey} size={{ xs: 12, md: fg.type === 'multi' ? 12 : 6 }}>
                      {fg.type === 'single'
                        ? <GroupSelectField group={fg} campos={campos} onChange={onChange} />
                        : <GroupCheckboxesField group={fg} campos={campos} onChange={onChange} />
                      }
                    </Grid>
                  ))}

                  {/* Campos sueltos después */}
                  {groupedLoose[g].map((key) => {
                    const value      = campos[key];
                    const schemaType = schemaTypeMap.get(key);
                    const type       = detectType(key, value, schemaType);
                    const isFullWidth = type === 'longtext' || type === 'dudas';
                    return (
                      <Grid key={key} size={{ xs: 12, md: isFullWidth ? 12 : 6 }}>
                        <FieldInput
                          fieldKey={key}
                          value={value}
                          schemaType={schemaType}
                          onChange={onChange}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              )}
            </Box>
          )
        )}
      </CardContent>
    </Card>
  );
};

export default AllFieldsForm;