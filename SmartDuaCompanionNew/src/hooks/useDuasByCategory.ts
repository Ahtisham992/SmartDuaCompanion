
// =====================================================
// src/hooks/useDuasByCategory.ts
// =====================================================
import { useEffect, useState } from 'react';
import { Dua } from '../types/dua.types';
import DatabaseService from '../services/database/DatabaseService';

export const useDuasByCategory = (categoryId: string) => {
  const [duas, setDuas] = useState<Dua[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDuas = async () => {
      try {
        setLoading(true);
        const result = await DatabaseService.getDuasByCategory(categoryId);
        setDuas(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load duas');
      } finally {
        setLoading(false);
      }
    };

    loadDuas();
  }, [categoryId]);

  return { duas, loading, error };
};