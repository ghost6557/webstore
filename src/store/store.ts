import { configureStore } from '@reduxjs/toolkit';

import { modalsSlice } from '@/store/slices/modalsSlice';
import { checkedItemsSlice } from '@/store/slices/checkedItemsSlice';
import { cartItemsCountSlice } from '@/store/slices/cartItemsCountSlice';

export const store = configureStore({
  reducer: {
    [modalsSlice.name]: modalsSlice.reducer,
    [checkedItemsSlice.name]: checkedItemsSlice.reducer,
    [cartItemsCountSlice.name]: cartItemsCountSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
