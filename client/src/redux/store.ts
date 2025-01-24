// src/redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import appIdSlice from './slices/setAppId';

const store = configureStore({
  reducer: {
    counter: counterReducer, // Add reducers here
    appId: appIdSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
