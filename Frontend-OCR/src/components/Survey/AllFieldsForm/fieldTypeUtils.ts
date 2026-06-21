// src/components/Survey/AllFieldsForm/fieldTypeUtils.ts
import type { SxProps, Theme } from '@mui/material/styles';

export function emptyFieldSx(isEmpty: boolean): SxProps<Theme> {
  return isEmpty
    ? { '& .MuiOutlinedInput-root': { bgcolor: YELLOW } }
    : {};
}
export type FieldType = 'boolean' | 'number' | 'longtext' | 'dudas' | 'text';
export type TabGroup = 'p1' | 'p2' | 'p3' | 'p4' | 'otros';

export const AT_BOOL    = new Set(['checkbox']);
export const AT_NUMBER  = new Set(['number', 'currency', 'percent', 'rating', 'duration', 'autoNumber', 'count']);
export const AT_LONG    = new Set(['multilineText', 'richText']);

export const LONG_TEXT_FIELDS = new Set([
  'p2_plano_terreno_descripcion',
  'p3_integrantes_texto_crudo',
  '_observaciones',
  'p3_comentarios',
  'p4_vivienda_observaciones',
]);

export const TAB_LABELS: Record<TabGroup, string> = {
  p1:    'Formulario 1',
  p2:    'Formulario 2',
  p3:    'Formulario 3',
  p4:    'Formulario 4',
  otros: 'General',
};

export const TAB_GROUPS: TabGroup[] = ['p1', 'p2', 'p3', 'p4', 'otros'];

export const YELLOW = '#FFFDE7';
export const YELLOW_BORDER = '#FFE082';

export function getTabGroup(key: string): TabGroup {
  if (/^p1_/.test(key)) return 'p1';
  if (/^p2_/.test(key)) return 'p2';
  if (/^p3_/.test(key)) return 'p3';
  if (/^p4_/.test(key)) return 'p4';
  return 'otros';
}

export function detectType(key: string, value: any, schemaType?: string): FieldType {
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

export function hasValue(value: any): boolean {
  if (value === null || value === undefined || value === '') return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function toBool(value: any): boolean {
  if (typeof value === 'boolean') return value;
  return value === 'true' || value === '1';
}