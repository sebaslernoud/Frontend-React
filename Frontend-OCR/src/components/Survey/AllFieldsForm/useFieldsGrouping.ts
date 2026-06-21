// src/components/Survey/AllFieldsForm/useFieldsGrouping.ts
import { useMemo } from 'react';
import { getSchemaFields } from '../../../services/airTableService';
import {
  FIELD_GROUPS, GROUPED_FIELD_KEYS,
  getSingleGroupValue, getMultiGroupValues,
  type FieldGroup,
} from '../../../config/fieldGroups';
import { TAB_GROUPS, type TabGroup, getTabGroup, hasValue } from './fieldTypeUtils';

export function useFieldsGrouping(campos: Record<string, any>) {
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
    const groups: Record<TabGroup, string[]> = { p1: [], p2: [], p3: [], p4: [], otros: [] };
    for (const key of looseKeys) groups[getTabGroup(key)].push(key);
    for (const g of TAB_GROUPS) groups[g].sort();
    return groups;
  }, [looseKeys]);

  // Agrupar las preguntas (fieldGroups) por formulario, según el prefijo de su primera opción
  const groupedFieldGroups = useMemo(() => {
    const groups: Record<TabGroup, FieldGroup[]> = { p1: [], p2: [], p3: [], p4: [], otros: [] };
    for (const fg of FIELD_GROUPS) {
      const firstKey = fg.options[0]?.key ?? '';
      groups[getTabGroup(firstKey)].push(fg);
    }
    return groups;
  }, []);

  const completionCounts = useMemo(() => {
    const counts: Record<TabGroup, { filled: number; total: number }> = {
      p1: { filled: 0, total: 0 }, p2: { filled: 0, total: 0 },
      p3: { filled: 0, total: 0 }, p4: { filled: 0, total: 0 },
      otros: { filled: 0, total: 0 },
    };
    for (const key of looseKeys) {
      const g = getTabGroup(key);
      counts[g].total++;
      if (hasValue(campos[key])) counts[g].filled++;
    }
    for (const g of TAB_GROUPS) {
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

  return { schemaTypeMap, looseKeys, groupedLoose, groupedFieldGroups, completionCounts };
}