// src/services/airtableService.ts

const AIRTABLE_TOKEN   = import.meta.env.VITE_AIRTABLE_TOKEN;
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID;
const AIRTABLE_TABLE   = 'RelevamientosOCR-Modulo';

const BASE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE)}`;

const HEADERS = {
  'Authorization': `Bearer ${AIRTABLE_TOKEN}`,
  'Content-Type':  'application/json',
};

export interface Relevamiento {
  _id:                  string;
  id_relevamiento:      string | null;
  fecha:                string | null;
  barrio_zona:          string | null;
  direccion:            string | null;
  prioridad:            string | null;
  personas_en_vivienda: number | null;
  tiene_bano:           boolean | null;
  json_completo:        any | null;
  fecha_de_carga:       string | null;
  ultima_modificacion:  string | null;
}

function aplanarRegistro(record: any): Relevamiento {
  const f = record.fields;
  return {
    _id:                  record.id,
    id_relevamiento:      f['ID_relevamiento']      ?? null,
    fecha:                f['Fecha']                ?? null,
    barrio_zona:          f['Barrio/Zona']           ?? null,
    direccion:            f['Dirección']             ?? null,
    prioridad:            f['Prioridad']             ?? null,
    personas_en_vivienda: f['Personas en vivienda']  ?? null,
    tiene_bano:           f['Tiene baño']            ?? null,
    json_completo: (() => {
    const raw = f['JSON completo'];
        if (!raw) return null;
        if (typeof raw === 'string') return JSON.parse(raw);
        return raw;
    })(),
    fecha_de_carga:       f['Fecha de carga']         ?? null,
    ultima_modificacion:  f['Última modificación']    ?? null,
  };
}

export async function fetchRelevamientos(): Promise<Relevamiento[]> {
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
  const res = await fetch(`${BASE_URL}/${id}`, { headers: HEADERS });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Airtable error: ${err.error?.message ?? res.status}`);
  }

  const data = await res.json();
  return aplanarRegistro(data);
}

export function formatFecha(fechaRaw: string | null): string {
  if (!fechaRaw) return 'Sin fecha';
  const fecha = new Date(fechaRaw);
  if (isNaN(fecha.getTime())) return fechaRaw; // si no parsea, devuelve el original
  return fecha.toLocaleDateString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export async function updateRelevamiento(id: string, fields: Record<string, any>): Promise<Relevamiento> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: HEADERS,
    body: JSON.stringify({ fields }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Airtable error: ${err.error?.message ?? res.status}`);
  }

  return aplanarRegistro(await res.json());
}