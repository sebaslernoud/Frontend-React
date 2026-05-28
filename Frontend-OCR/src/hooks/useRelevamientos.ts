// src/hooks/useRelevamientos.ts
import { useEffect, useState } from 'react';
import { fetchRelevamientos, type Relevamiento } from '../services/airTableService';

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