import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const fetchCartItemsCountByUserId = createAsyncThunk(
  'cart/fetchCountByUserId',
  async (userId: string) => {
    const res = await fetch(`/api/cart/${userId}?type=getCount`);
    const data = await res.json();
    // console.log('dfhdfh ' + data);
    return data;
  }
);

export const cartItemsCountSlice = createSlice({
  name: 'cartItemsCount',
  initialState: { itemsCount: 0 },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchCartItemsCountByUserId.fulfilled, (state, action) => {
      //   console.log(action.payload);
      state.itemsCount = action.payload;
    });
  },
});

export const getCartItemsCount = (state: RootState) =>
  state.cartItemsCount.itemsCount;
