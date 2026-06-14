import React, { useState, useMemo } from 'react';
import {
  Box, Card, CardContent, Tabs, Tab, Grid,
  TextField, Switch, FormControlLabel,
  Chip, Typography, Button,
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { getSchemaFields } from '../../services/airTableService';

export interface AllFieldsFormProps {
  campos: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onSave: () => void;
  saving?: boolean;
}

type FieldType = 'boolean' | 'number' | 'longtext' | 'dudas' | 'text';
type Group = 'p1' | 'p2' | 'p3' | 'p4' | 'otros';

// Airtable field types → our render type
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
  // Schema type takes priority — handles null values that have no JS type
  if (schemaType) {
    if (AT_BOOL.has(schemaType))   return 'boolean';
    if (AT_NUMBER.has(schemaType)) return 'number';
    if (AT_LONG.has(schemaType))   return 'longtext';
  }
  // Value-based fallback
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

// ─── Field input ──────────────────────────────────────────────────────────────
interface FieldInputProps {
  fieldKey:   string;
  value:      any;
  schemaType: string | undefined;
  onChange:   (key: string, value: any) => void;
}

const YELLOW = '#FFFDE7';
const YELLOW_BORDER = '#FFE082';

const FieldInput: React.FC<FieldInputProps> = ({ fieldKey, value, schemaType, onChange }) => {
  const type    = detectType(fieldKey, value, schemaType);
  const isEmpty = !hasValue(value);

  // Yellow tint on the MUI input background when the field has no value
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
          {fieldKey}
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
          label={<Typography variant="body2">{fieldKey}</Typography>}
          sx={{ ml: 0, width: '100%' }}
        />
      </Box>
    );
  }

  if (type === 'number') {
    return (
      <TextField
        label={fieldKey}
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
        label={fieldKey}
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
      label={fieldKey}
      value={value ?? ''}
      onChange={(e) => onChange(fieldKey, e.target.value)}
      fullWidth size="small"
      InputLabelProps={{ shrink: true }}
      sx={inputSx}
    />
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
const AllFieldsForm: React.FC<AllFieldsFormProps> = ({ campos, onChange, onSave, saving = false }) => {
  const [activeTab, setActiveTab] = useState(0);

  // Build schema type lookup: fieldName → airtable type
  const schemaTypeMap = useMemo(() => {
    return new Map(getSchemaFields().map(f => [f.name, f.type]));
  }, []); // schema is module-level cache, stable after first fetch

  // All keys = schema fields (including nulls) + any extras returned by Airtable
  const allKeys = useMemo(() => {
    const set = new Set([
      ...getSchemaFields().map(f => f.name),
      ...Object.keys(campos),
    ]);
    return Array.from(set);
  }, [campos]);

  const grouped = useMemo(() => {
    const groups: Record<Group, string[]> = { p1: [], p2: [], p3: [], p4: [], otros: [] };
    for (const key of allKeys) groups[getGroup(key)].push(key);
    for (const g of GROUPS) groups[g].sort();
    return groups;
  }, [allKeys]);

  const completionCounts = useMemo(() => {
    const counts: Record<Group, { filled: number; total: number }> = {
      p1: { filled: 0, total: 0 }, p2: { filled: 0, total: 0 },
      p3: { filled: 0, total: 0 }, p4: { filled: 0, total: 0 },
      otros: { filled: 0, total: 0 },
    };
    for (const key of allKeys) {
      const g = getGroup(key);
      counts[g].total++;
      if (hasValue(campos[key])) counts[g].filled++;
    }
    return counts;
  }, [allKeys, campos]);

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
              {allKeys.length} campos — edición completa del relevamiento
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
              {grouped[g].length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  Sin campos en este formulario.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {grouped[g].map((key) => {
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
