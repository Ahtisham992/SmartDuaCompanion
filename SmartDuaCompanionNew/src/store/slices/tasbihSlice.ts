// src/store/slices/tasbihSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TasbihState {
  count: number;
  target: number;
  history: {
    date: string;
    count: number;
  }[];
}

const initialState: TasbihState = {
  count: 0,
  target: 33, // Default target (can be 33, 99, 100, etc.)
  history: [],
};

const tasbihSlice = createSlice({
  name: 'tasbih',
  initialState,
  reducers: {
    increment: (state) => {
      state.count += 1;
    },
    reset: (state) => {
      // Save to history before reset
      if (state.count > 0) {
        state.history.unshift({
          date: new Date().toISOString(),
          count: state.count,
        });
        // Keep only last 30 records
        if (state.history.length > 30) {
          state.history = state.history.slice(0, 30);
        }
      }
      state.count = 0;
    },
    setTarget: (state, action: PayloadAction<number>) => {
      state.target = action.payload;
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
});

export const { increment, reset, setTarget, clearHistory } = tasbihSlice.actions;
export default tasbihSlice.reducer;