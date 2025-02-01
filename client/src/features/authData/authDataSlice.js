import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accessToken: '',
  userData: null,
};

export const authDataSlice = createSlice({
  name: 'authData',
  initialState,
  reducers: {
    saveAuthData: (state, action) => {
      state.accessToken = action.payload.accessToken || '';
      state.userData = action.payload.userData || null;
    },
    deleteAuthData: (state) => {

      state.accessToken = undefined;
      state.userData = undefined;
    },
  },
});

export const { saveAuthData, deleteAuthData } = authDataSlice.actions;

export default authDataSlice.reducer;