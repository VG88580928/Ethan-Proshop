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
    orderCreateReset: (state) => (state = {}),
  },
});

export const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState: { pending: true }, // 這邊 pending: true 一定要加，不然剛進 OrderScreen 會直接報錯，跑不出 Loader
  reducers: {
    orderDetailsRequest: (state) => {
      state.pending = true;
    },
    orderDetailsSuccess: (state, action) => {
      state.pending = false;
      state.order = action.payload;
    },
    orderDetailsFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
  },
});

export const orderPaySlice = createSlice({
  name: 'orderPay',
  initialState: {},
  reducers: {
    orderPayRequest: (state) => {
      state.pending = true;
    },
    orderPaySuccess: (state) => {
      state.pending = false;
      state.success = true;
    },
    orderPayFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
    orderPayReset: (state) => (state = {}), // 不要寫成 (state) => {state = {};} !! 寫成這樣會改不到 state，因為我們是要清空 state 而不是更新 state
  },
});

export const myOrderListSlice = createSlice({
  name: 'myOrderList',
  initialState: { orders: [] },
  reducers: {
    myOrderListRequest: (state) => {
      state.pending = true;
    },
    myOrderListSuccess: (state, action) => {
      state.pending = false;
      state.orders = action.payload;
    },
    myOrderListFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
  },
});

// Action creaters
export const {
  orderCreateRequest,
  orderCreateSuccess,
  orderCreateFail,
  orderCreateReset,
} = orderCreateSlice.actions;
export const { orderDetailsRequest, orderDetailsSuccess, orderDetailsFail } =
  orderDetailsSlice.actions;
export const { orderPayRequest, orderPaySuccess, orderPayFail, orderPayReset } =
  orderPaySlice.actions;
export const { myOrderListRequest, myOrderListSuccess, myOrderListFail } =
  myOrderListSlice.actions;

// reducers
export const orderCreateReducer = orderCreateSlice.reducer;
export const orderDetailsReducer = orderDetailsSlice.reducer;
export const orderPayReducer = orderPaySlice.reducer;
export const myOrderListReducer = myOrderListSlice.reducer;
