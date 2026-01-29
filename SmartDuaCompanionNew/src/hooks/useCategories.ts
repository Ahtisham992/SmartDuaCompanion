// =====================================================
// src/hooks/useCategories.ts
// =====================================================
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchCategories } from '../store/slices/duaSlice';

export const useCategories = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, loading, error } = useSelector((state: RootState) => state.dua);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  const refresh = async () => {
    await dispatch(fetchCategories());
  };

  return { categories, loading, error, refresh };
};
