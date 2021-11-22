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
    orderCreateReset: () => ({}),
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
    orderPayReset: () => ({}), // 不要寫成 (state) => {state = {};} !! 寫成這樣會改不到 state，因為我們是要清空 state 而不是更新 state
  },
});

export const orderDeliverSlice = createSlice({
  name: 'orderDeliver',
  initialState: {},
  reducers: {
    orderDeliverRequest: (state) => {
      state.pending = true;
    },
    orderDeliverSuccess: (state) => {
      state.pending = false;
      state.success = true;
    },
    orderDeliverFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
    orderDeliverReset: () => ({}),
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

export const orderListSlice = createSlice({
  name: 'orderList',
  initialState: { orders: [] },
  reducers: {
    orderListRequest: (state) => {
      state.pending = true;
    },
    orderListSuccess: (state, action) => {
      state.pending = false;
      state.orders = action.payload;
    },
    orderListFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
  },
});

// 導出 Action creaters
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
export const { orderListRequest, orderListSuccess, orderListFail } =
  orderListSlice.actions;
export const {
  orderDeliverRequest,
  orderDeliverSuccess,
  orderDeliverFail,
  orderDeliverReset,
} = orderDeliverSlice.actions;

// 導出 reducers
export const orderCreateReducer = orderCreateSlice.reducer;
export const orderDetailsReducer = orderDetailsSlice.reducer;
export const orderPayReducer = orderPaySlice.reducer;
export const myOrderListReducer = myOrderListSlice.reducer;
export const orderListReducer = orderListSlice.reducer;
export const orderDeliverReducer = orderDeliverSlice.reducer;
