// src/components/Survey/AllFieldsForm/index.tsx
import React, { useState } from 'react';
import { Box, Card, CardContent, Tabs, Tab, Grid, Chip, Typography, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

import FieldInput from './FieldInput';
import GroupSelectField from './GroupSelectField';
import GroupCheckboxesField from './GroupCheckboxesField';
import { useFieldsGrouping } from './useFieldsGrouping';
import { TAB_GROUPS, TAB_LABELS, detectType } from './fieldTypeUtils';
import { FIELD_GROUPS } from '../../../config/fieldGroups';

export interface AllFieldsFormProps {
  campos: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onSave: () => void;
  saving?: boolean;
}

const AllFieldsForm: React.FC<AllFieldsFormProps> = ({ campos, onChange, onSave, saving = false }) => {
  const [activeTab, setActiveTab] = useState(0);
  const { schemaTypeMap, looseKeys, groupedLoose, groupedFieldGroups, completionCounts } =
    useFieldsGrouping(campos);

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
            {TAB_GROUPS.map((g, i) => {
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

        {TAB_GROUPS.map((g, i) =>
          activeTab !== i ? null : (
            <Box key={g} role="tabpanel" id={`allfields-tabpanel-${i}`}
              aria-labelledby={`allfields-tab-${i}`} sx={{ p: 3 }}>

              {groupedFieldGroups[g].length === 0 && groupedLoose[g].length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                  Sin campos en este formulario.
                </Typography>
              ) : (
                <Grid container spacing={2}>
                  {groupedFieldGroups[g].map((fg) => (
                    <Grid key={fg.groupKey} size={{ xs: 12, md: fg.type === 'multi' ? 12 : 6 }}>
                      {fg.type === 'single'
                        ? <GroupSelectField group={fg} campos={campos} onChange={onChange} />
                        : <GroupCheckboxesField group={fg} campos={campos} onChange={onChange} />
                      }
                    </Grid>
                  ))}

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