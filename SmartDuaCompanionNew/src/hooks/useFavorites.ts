
// =====================================================
// src/hooks/useFavorites.ts
// =====================================================
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchFavorites, toggleFavorite as toggleFav } from '../store/slices/duaSlice';

export const useFavorites = (duaId?: string) => {
  const dispatch = useDispatch<AppDispatch>();
  const favorites = useSelector((state: RootState) => state.dua.favorites);

  useEffect(() => {
    if (favorites.length === 0) {
      dispatch(fetchFavorites());
    }
  }, [dispatch, favorites.length]);

  const isFavorite = duaId ? favorites.includes(duaId) : false;

  const toggleFavorite = async () => {
    if (duaId) {
      await dispatch(toggleFav(duaId));
    }
  };

  return { favorites, isFavorite, toggleFavorite };
};