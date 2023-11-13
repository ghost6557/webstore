import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface CheckedItemsState {
  itemsList: {
    id: string;
    val: boolean | undefined;
  }[];
}

const initialCheckedItemsState: CheckedItemsState = {
  itemsList: [],
};

export const checkedItemsSlice = createSlice({
  name: 'checkedItems',
  initialState: initialCheckedItemsState,
  reducers: {
    updateItemsList: (state, action) => {
      console.log('ACTION PAYLOAD REDUX');
      console.log(action.payload);
      const { id: checkboxId, val: checkboxVal } = action.payload;
      let updatedList: any[] = [];
      if (state.itemsList.length) {
        const matchedCheckbox = state.itemsList.find(
          (cbx: any) => cbx.id === checkboxId
        );
        if (matchedCheckbox) {
          matchedCheckbox.val = checkboxVal;
          updatedList = state.itemsList;
        } else {
          updatedList = [
            ...state.itemsList,
            { id: checkboxId, val: checkboxVal },
          ];
        }
      } else if (!state.itemsList.length) {
        updatedList = [
          ...state.itemsList,
          { id: checkboxId, val: checkboxVal },
        ];
      }
      // console.log(updatedList);

      state.itemsList = updatedList;
    },
    updateItemsListOnDelete: (state, action) => {
      console.log('DELETE REDUX');
      console.log(action.payload);
      state.itemsList = action.payload;
    },
  },
});

export const { updateItemsList, updateItemsListOnDelete } =
  checkedItemsSlice.actions;
export const getCheckedItems = (state: RootState) =>
  state.checkedItems.itemsList;

export default checkedItemsSlice.reducer;
