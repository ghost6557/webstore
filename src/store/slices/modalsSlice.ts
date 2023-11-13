import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

const initialModalsState = {
  showAuthModal: false,
  showCartModal: false,
  showOrdersModal: false,
};

export const modalsSlice = createSlice({
  name: 'modals',
  initialState: initialModalsState,
  reducers: {
    toggleAuthModal: (state) => {
      state.showAuthModal = !state.showAuthModal;
    },
    toggleCartModal: (state) => {
      state.showCartModal = !state.showCartModal;
    },
    toggleOrdersModal: (state) => {
      state.showOrdersModal = !state.showOrdersModal;
    },
  },
});

export const { toggleAuthModal, toggleCartModal, toggleOrdersModal } =
  modalsSlice.actions;
export const getShowAuthModal = (state: RootState) =>
  state.modals.showAuthModal;
export const getShowCartModal = (state: RootState) =>
  state.modals.showCartModal;
export const getShowOrdersModal = (state: RootState) =>
  state.modals.showOrdersModal;

export default modalsSlice.reducer;
