// src/services/googleSheetsService.ts
const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL;

export async function saveSurveyToSheets(campos: Record<string, any>): Promise<void> {
  if (!APPS_SCRIPT_URL) {
    throw new Error(
      'La URL de Google Apps Script no está configurada en el archivo .env (VITE_APPS_SCRIPT_URL)'
    );
  }

  const inspeccion: Record<string, any> = {};
  const encuesta: Record<string, any>   = {};

  for (const [key, value] of Object.entries(campos)) {
    if (key.startsWith('p1_') || key.startsWith('p2_')) {
      inspeccion[key] = value;
    } else if (key.startsWith('p3_') || key.startsWith('p4_')) {
      encuesta[key] = value;
    }
  }

  const body = JSON.stringify({
    multiSheet: true,
    sheets: [
      { name: 'Inspeccion Tecnica', data: inspeccion },
      { name: 'Encuesta',           data: encuesta   },
    ],
  });

  // Google Apps Script no envía CORS headers en el redirect,
  // así que usamos 'no-cors'. La respuesta queda opaca (no legible)
  // pero los datos llegan correctamente al script.
  await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body,
  });

  // Con no-cors no podemos leer la respuesta — asumimos éxito si no hubo network error
}