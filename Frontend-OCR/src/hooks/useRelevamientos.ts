// src/hooks/useRelevamientos.ts
// src/hooks/useRelevamientos.ts
import { useEffect, useState } from 'react';
import { fetchRelevamientos, fetchRelevamientosPreview, fetchRelevamientoById, type Relevamiento, type RelevamientoPreview} from '../services/airTableService';

export function useRelevamientos() {
  const [data, setData]       = useState<Relevamiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetchRelevamientos()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useRelevamientosPreview() {
  const [data, setData]       = useState<RelevamientoPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetchRelevamientosPreview()
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useRelevamientoById(id: string) {
  const [data, setData]       = useState<Relevamiento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchRelevamientoById(id)
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}