
// =====================================================
// src/hooks/useDua.ts
// =====================================================
import { useEffect, useState } from 'react';
import { Dua } from '../types/dua.types';
import DatabaseService from '../services/database/DatabaseService';

export const useDua = (duaId: string) => {
  const [dua, setDua] = useState<Dua | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDua = async () => {
      try {
        setLoading(true);
        const result = await DatabaseService.getDuaById(duaId);
        setDua(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dua');
      } finally {
        setLoading(false);
      }
    };

    loadDua();
  }, [duaId]);

  return { dua, loading, error };
};