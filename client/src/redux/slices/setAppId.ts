// src/redux/slices/counterSlice.ts
import { createSlice } from '@reduxjs/toolkit';

interface SetAppId {
  value: string;
}

const initialState: SetAppId = {
  value: '0',
};

const appIdSlice = createSlice({
  name: 'appId',
  initialState,
  reducers: {
    setAppId: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { setAppId } = appIdSlice.actions;
export default appIdSlice.reducer;
