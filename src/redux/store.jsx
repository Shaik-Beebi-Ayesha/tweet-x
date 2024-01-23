import { configureStore } from '@reduxjs/toolkit';
import featuresReducer from './features/featuresSlice';

export const store = configureStore({
  reducer: {
    features: featuresReducer,
  },
});

export default store;
