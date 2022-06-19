import { createSlice } from '@reduxjs/toolkit';

const initialState = {};

const transactionsSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setTransaction: (state, action) => {
      return { transaction: action.payload };
    },
  },
});

const { reducer, actions } = transactionsSlice;

export const { setTransaction } = actions;
export default reducer;
