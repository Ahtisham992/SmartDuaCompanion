// src/store/index.ts
import { configureStore, combineReducers, AnyAction, Reducer } from '@reduxjs/toolkit';
import { 
  persistStore, 
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';

import duaReducer from './slices/duaSlice';
import userReducer from './slices/userSlice';
import settingsReducer from './slices/settingsSlice';
import searchReducer from './slices/searchSlice';
import tasbihReducer from './slices/tasbihSlice';     // ADD THIS
import namesReducer from './slices/namesSlice';       // ADD THIS

// 1. Define the combined reducer first
const appReducer = combineReducers({
  dua: duaReducer,
  user: userReducer,
  settings: settingsReducer,
  search: searchReducer,
  tasbih: tasbihReducer,     // ADD THIS
  names: namesReducer,        // ADD THIS
});

// 2. Extract the RootState type from it
export type RootState = ReturnType<typeof appReducer>;

// 3. Create the Reset-Capable Root Reducer
// We explicitly tell TypeScript that 'state' can be RootState or undefined
const rootReducer: Reducer<RootState, AnyAction> = (state, action) => {
  if (action.type === 'RESET_APP') {
    // Instead of 'state = undefined', we pass undefined directly to the appReducer.
    // This forces all child reducers to reset to their initialState.
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

// 4. Persist Config
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  // Whitelist: persist these slices. 
  // 'dua' is excluded so it always reloads from JSON on a reset/update.
  whitelist: ['user', 'settings', 'tasbih', 'names'], // ADD 'tasbih' and 'names'
};

// 5. Wrap the rootReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;