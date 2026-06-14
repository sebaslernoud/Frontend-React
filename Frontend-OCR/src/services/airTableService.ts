// src/services/airtableService.ts

const AIRTABLE_TOKEN   = import.meta.env.VITE_AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE   = 'RelevamientosOCR-ModuloSanitarios';

const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`;
const META_URL = `https://api.airtable.com/v0/meta/bases/${AIRTABLE_BASE_ID}/tables`;

const HEADERS = {
  'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
  'Content-Type':  'application/json',
};

// ─── Schema cache ────────────────────────────────────────────────────────────
export interface AirtableFieldMeta {
  name: string;
  type: string; // 'checkbox', 'number', 'singleLineText', 'multilineText', etc.
}

let schemaFields: AirtableFieldMeta[] = [];

async function ensureSchema(): Promise<void> {
  if (schemaFields.length > 0) return;
  try {
    const res = await fetch(META_URL, { headers: HEADERS });
    if (!res.ok) { console.warn('[Airtable schema] error', res.status); return; }
    const data = await res.json();
    const table = data.tables?.find((t: any) => t.name === AIRTABLE_TABLE);
    if (table) {
      schemaFields = table.fields.map((f: any) => ({ name: f.name, type: f.type }));
      console.log(`[Airtable schema] ${schemaFields.length} campos cargados`);
    }
  } catch (e) {
    console.warn('[Airtable schema] No se pudo cargar el esquema:', e);
  }
}

/** Returns the cached field schema (populated after first fetch). */
export function getSchemaFields(): AirtableFieldMeta[] {
  return schemaFields;
}

// ─── Relevamiento interface ───────────────────────────────────────────────────
export interface Relevamiento {
  _id:                  string;
  id_relevamiento:      string | null;
  fecha:                string | null;
  barrio_zona:          string | null;
  direccion:            string | null;
  prioridad:            string | null;
  personas_en_vivienda: number | null;
  tiene_bano:           boolean | null;
  fecha_de_carga:       string | null;
  ultima_modificacion:  string | null;
  estado:               string | null;
  campos:               Record<string, any>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function parseDudas(raw: unknown): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as string[];
  if (typeof raw === 'string') {
    try { return JSON.parse(raw); } catch { return []; }
  }
  return [];
}

function aplanarRegistro(record: any): Relevamiento {
  const f = record.fields;

  if (typeof window !== 'undefined' && !(window as any).__AIRTABLE_TYPE_LOGGED) {
    console.log('[Airtable tipos] Primer record.fields sample:', f);
    (window as any).__AIRTABLE_TYPE_LOGGED = true;
  }

  // Pre-initialize every schema field to null so empty fields appear in the UI
  const campos: Record<string, any> = {};
  for (const { name } of schemaFields) {
    campos[name] = null;
  }
  // Overlay with actual values (Airtable only returns non-empty fields)
  for (const key of Object.keys(f)) {
    campos[key] = key === '_dudas' ? parseDudas(f[key]) : f[key];
  }

  return {
    _id:                  record.id,
    id_relevamiento:      f['ID_relevamiento']     ?? null,
    fecha:                f['Fecha']               ?? null,
    barrio_zona:          f['Barrio/Zona']          ?? null,
    direccion:            f['Dirección']            ?? null,
    prioridad:            f['Prioridad']            ?? null,
    personas_en_vivienda: f['Personas en vivienda'] ?? null,
    tiene_bano:           f['Tiene baño']           ?? null,
    fecha_de_carga:       f['Fecha de carga']        ?? null,
    ultima_modificacion:  f['Última modificación']   ?? null,
    estado:               f['Estado']              ?? null,
    campos,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────
export async function fetchRelevamientos(): Promise<Relevamiento[]> {
  await ensureSchema();
  let todos: Relevamiento[] = [];
  let offset: string | null = null;

  do {
    const url = offset ? `${BASE_URL}?offset=${offset}` : BASE_URL;
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(`Airtable error: ${err.error?.message ?? res.status}`);
    }
    const data = await res.json();
    todos = [...todos, ...data.records.map(aplanarRegistro)];
    offset = data.offset ?? null;
  } while (offset);

  return todos;
}

export async function fetchRelevamientoById(id: string): Promise<Relevamiento> {
  await ensureSchema();
  const res = await fetch(`${BASE_URL}/${id}`, { headers: HEADERS });
  if (!res.ok) {
    const err = await res.json();
    console.error('AIRTABLE error:', err.error?.type, '|', err.error?.message);
    throw new Error(`Airtable error: ${err.error?.message ?? res.status}`);
  }
  return aplanarRegistro(await res.json());
}

export function formatFecha(fechaRaw: string | null): string {
  if (!fechaRaw) return 'Sin fecha';
  const fecha = new Date(fechaRaw);
  if (isNaN(fecha.getTime())) return fechaRaw;
  return fecha.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export async function updateRelevamiento(id: string, fields: Record<string, any>): Promise<Relevamiento> {
  const fieldsToSend = { ...fields };
  if (Array.isArray(fieldsToSend['_dudas'])) {
    fieldsToSend['_dudas'] = JSON.stringify(fieldsToSend['_dudas']);
  }

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({ fields: fieldsToSend }),
  });

  if (!res.ok) {
    const err = await res.json();
    console.error('[Airtable PATCH error] fields sent:', Object.keys(fieldsToSend));
    console.error('[Airtable PATCH error] body:', JSON.stringify(err, null, 2));
    throw new Error(`Airtable error (${res.status}): ${err.error?.message ?? 'unknown'}`);
  }

  return aplanarRegistro(await res.json());
}
