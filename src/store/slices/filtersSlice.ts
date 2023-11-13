import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialFilters = {
  forPage: null,
  brand: null,
  rom: null,
};

const filtersSlice = createSlice({
  name: 'filters',
  initialState: initialFilters,
  reducers: {
    dropFilters: (state) => {
      state.forPage = null;
      state.brand = null;
      state.rom = null;
    },
    updateFilters: (state) => {},
  },
});
