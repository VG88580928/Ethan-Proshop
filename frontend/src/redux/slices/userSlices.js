import { createSlice } from '@reduxjs/toolkit';

export const userLoginSlice = createSlice({
  name: 'userLogin',
  initialState: {},
  reducers: {
    loginRequest: (state) => {
      state.pending = true; // 注意要用 curly braces,不然 arrow function 自動 return 的時候 immer 會出錯 (參考: https://immerjs.github.io/immer/return/)
    },
    loginSuccess: (state, action) => {
      state.pending = false;
      state.userInfo = action.payload;
    },
    loginFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
    logout: (state) => (state = {}), // 清空 state (若 initialState 有其他初始值也會一併清空)
  },
});

export const userRegisterSlice = createSlice({
  name: 'userRegister',
  initialState: {},
  reducers: {
    registerRequest: (state) => {
      state.pending = true;
    },
    registerSuccess: (state, action) => {
      state.pending = false;
      state.userInfo = action.payload;
    },
    registerFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
    userLogout: (state) => (state = {}),
  },
});

export const userDetailsSlice = createSlice({
  name: 'userDetails',
  initialState: { user: {} },
  reducers: {
    detailsRequest: (state) => {
      state.pending = true;
    },
    detailsSuccess: (state, action) => {
      state.pending = false;
      state.user = action.payload;
    },
    detailsFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
  },
});

export const userUpdateProfileSlice = createSlice({
  name: 'userUpdateProfile',
  initialState: {},
  reducers: {
    updateProfileRequest: (state) => {
      state.pending = true;
    },
    updateProfileSuccess: (state, action) => {
      state.pending = false;
      state.userInfo = action.payload;
      state.success = true;
    },
    updateProfileFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
  },
});

// Action creaters
export const { loginRequest, loginSuccess, loginFail, logout } =
  userLoginSlice.actions;
export const { registerRequest, registerSuccess, registerFail, userLogout } =
  userRegisterSlice.actions;
export const { detailsRequest, detailsSuccess, detailsFail } =
  userDetailsSlice.actions;
export const { updateProfileRequest, updateProfileSuccess, updateProfileFail } =
  userUpdateProfileSlice.actions;

// Reducers
export const userLoginReducer = userLoginSlice.reducer;
export const userRegisterReducer = userRegisterSlice.reducer;
export const userDetailsReducer = userDetailsSlice.reducer;
export const userUpdateProfileReducer = userUpdateProfileSlice.reducer;
