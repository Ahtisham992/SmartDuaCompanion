// src/store/slices/userSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  isFirstLaunch: boolean;
  lastActiveDate: string | null;
  duaReadCount: number;
  streak: number;
}

const initialState: UserState = {
  isFirstLaunch: true,
  lastActiveDate: null,
  duaReadCount: 0,
  streak: 0,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setFirstLaunchComplete: (state) => {
      state.isFirstLaunch = false;
    },
    updateLastActive: (state, action: PayloadAction<string>) => {
      state.lastActiveDate = action.payload;
    },
    incrementDuaReadCount: (state) => {
      state.duaReadCount += 1;
    },
    updateStreak: (state, action: PayloadAction<number>) => {
      state.streak = action.payload;
    },
  },
});

export const {
  setFirstLaunchComplete,
  updateLastActive,
  incrementDuaReadCount,
  updateStreak,
} = userSlice.actions;

export default userSlice.reducer;