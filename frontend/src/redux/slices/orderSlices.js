import { createSlice } from '@reduxjs/toolkit';

export const orderCreateSlice = createSlice({
  name: 'orderCreate',
  initialState: {},
  reducers: {
    orderCreateRequest: (state) => {
      state.pending = true;
    },
    orderCreateSuccess: (state, action) => {
      state.pending = false;
      state.success = true;
      state.order = action.payload;
    },
    orderCreateFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
  },
});

// Action creaters
export const { orderCreateRequest, orderCreateSuccess, orderCreateFail } =
  orderCreateSlice.actions;

// reducers
export const orderCreateReducer = orderCreateSlice.reducer;
