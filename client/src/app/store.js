import { configureStore } from '@reduxjs/toolkit';
import authDataReducer from '../features/authData/authDataSlice';

export const store = configureStore({
  reducer: {
    authData: authDataReducer,
  },
});