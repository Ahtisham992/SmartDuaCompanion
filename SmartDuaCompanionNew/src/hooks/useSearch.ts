// =====================================================
// src/hooks/useSearch.ts
// =====================================================
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { searchDuas, setQuery, clearSearch } from '../store/slices/searchSlice';

export const useSearch = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { query, results, loading, error } = useSelector(
    (state: RootState) => state.search
  );

  const performSearch = async (searchQuery: string) => {
    dispatch(setQuery(searchQuery));
    if (searchQuery.length >= 2) {
      await dispatch(searchDuas(searchQuery));
    }
  };

  const clear = () => {
    dispatch(clearSearch());
  };

  return { query, results, loading, error, performSearch, clear };
};