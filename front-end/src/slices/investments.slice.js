import { createSlice } from '@reduxjs/toolkit';

const investment = JSON.parse(localStorage.getItem('investment'));

const initialState = investment ? { investment } : {};

const investmentsSlice = createSlice({
  name: 'investment',
  initialState,
  reducers: {
    setInvestment: (state, action) => {
      return { investment: action.payload };
    },
  },
});

const { reducer, actions } = investmentsSlice;

export const { setInvestment } = actions;
export default reducer;
