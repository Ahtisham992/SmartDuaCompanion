// =====================================================
// src/hooks/useDuas.ts
// =====================================================
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchDuas } from '../store/slices/duaSlice';

export const useDuas = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { duas, loading, error } = useSelector((state: RootState) => state.dua);

  useEffect(() => {
    if (duas.length === 0) {
      dispatch(fetchDuas());
    }
  }, [dispatch, duas.length]);

  const refresh = async () => {
    await dispatch(fetchDuas());
  };

  return { duas, loading, error, refresh };
};