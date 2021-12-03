import { createSlice } from '@reduxjs/toolkit';

export const productDeleteSlice = createSlice({
  name: 'productDelete',
  initialState: {},
  reducers: {
    productDeleteRequest: (state) => {
      state.pending = true;
    },
    productDeleteSuccess: (state) => {
      state.pending = false;
      state.success = true;
    },
    productDeleteFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
    productDeleteReset: () => ({}),
  },
});

export const productCreateSlice = createSlice({
  name: 'productCreate',
  initialState: {},
  reducers: {
    productCreateRequest: (state) => {
      state.pending = true;
    },
    productCreateSuccess: (state, action) => {
      state.pending = false;
      state.success = true;
      state.product = action.payload;
    },
    productCreateFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
    productCreateReset: () => ({}),
  },
});

export const productUpdateSlice = createSlice({
  name: 'productUpdate',
  initialState: { product: {} },
  reducers: {
    productUpdateRequest: (state) => {
      state.pending = true;
    },
    productUpdateSuccess: (state, action) => {
      state.pending = false;
      state.success = true;
      state.product = action.payload;
    },
    productUpdateFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
    productUpdateReset: () => ({ product: {} }), // 如果想清空 state 又想保留 initialState 的寫法 (其實這邊目前用不到 product 資訊，寫來練習而已，但也許未來會用到)
  },
});

export const productReviewCreateSlice = createSlice({
  name: 'productReviewCreate',
  initialState: {},
  reducers: {
    productReviewCreateRequest: (state) => {
      state.pending = true;
    },
    productReviewCreateSuccess: (state) => {
      state.pending = false;
      state.success = true;
    },
    productReviewCreateFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
    productReviewCreateReset: () => ({}),
  },
});

export const productTopRatedSlice = createSlice({
  name: 'productTopRated',
  initialState: { products: [] },
  reducers: {
    productTopRatedRequest: (state) => {
      state.pending = true;
    },
    productTopRatedSuccess: (state, action) => {
      state.pending = false;
      state.products = action.payload;
    },
    productTopRatedFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
  },
});

// 導出 Action creaters
export const {
  productDeleteRequest,
  productDeleteSuccess,
  productDeleteFail,
  productDeleteReset,
} = productDeleteSlice.actions;

export const {
  productCreateRequest,
  productCreateSuccess,
  productCreateFail,
  productCreateReset,
} = productCreateSlice.actions;

export const {
  productReviewCreateRequest,
  productReviewCreateSuccess,
  productReviewCreateFail,
  productReviewCreateReset,
} = productReviewCreateSlice.actions;

export const {
  productUpdateRequest,
  productUpdateSuccess,
  productUpdateFail,
  productUpdateReset,
} = productUpdateSlice.actions;

export const {
  productTopRatedRequest,
  productTopRatedSuccess,
  productTopRatedFail,
} = productTopRatedSlice.actions;

// 導出 reducers
export const productDeleteReducer = productDeleteSlice.reducer;
export const productCreateReducer = productCreateSlice.reducer;
export const productUpdateReducer = productUpdateSlice.reducer;
export const productReviewCreateReducer = productReviewCreateSlice.reducer;
export const productTopRatedReducer = productTopRatedSlice.reducer;
