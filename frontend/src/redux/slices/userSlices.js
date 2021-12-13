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
    logout: () => ({}), // 清空 state (若 initialState 有其他初始值也會一併清空)
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
    userLogout: () => ({}),
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

export const userListSlice = createSlice({
  name: 'userList',
  initialState: { users: [] },
  reducers: {
    userListRequest: (state) => {
      state.pending = true;
    },
    userListSuccess: (state, action) => {
      state.pending = false;
      state.users = action.payload;
    },
    userListFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
  },
});

export const userDeleteSlice = createSlice({
  name: 'userDelete',
  initialState: {},
  reducers: {
    userDeleteRequest: (state) => {
      state.pending = true;
    },
    userDeleteSuccess: (state) => {
      state.pending = false;
      state.success = true;
    },
    userDeleteFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
    userDeleteReset: () => ({}),
  },
});

export const userUpdateSlice = createSlice({
  name: 'userUpdate',
  initialState: {},
  reducers: {
    userUpdateRequest: (state) => {
      state.pending = true;
    },
    userUpdateSuccess: (state) => {
      state.pending = false;
      state.success = true;
    },
    userUpdateFail: (state, action) => {
      state.pending = false;
      state.error = action.payload;
    },
    userUpdateReset: () => ({}),
  },
});

// 導出 Action creaters
export const { loginRequest, loginSuccess, loginFail, logout } =
  userLoginSlice.actions;
export const { registerRequest, registerSuccess, registerFail, userLogout } =
  userRegisterSlice.actions;
export const { detailsRequest, detailsSuccess, detailsFail } =
  userDetailsSlice.actions;
export const { updateProfileRequest, updateProfileSuccess, updateProfileFail } =
  userUpdateProfileSlice.actions;
export const { userListRequest, userListSuccess, userListFail } =
  userListSlice.actions;
export const {
  userDeleteRequest,
  userDeleteSuccess,
  userDeleteFail,
  userDeleteReset,
} = userDeleteSlice.actions;
export const {
  userUpdateRequest,
  userUpdateSuccess,
  userUpdateFail,
  userUpdateReset,
} = userUpdateSlice.actions;

// 導出 Reducers
export const userLoginReducer = userLoginSlice.reducer;
export const userRegisterReducer = userRegisterSlice.reducer;
export const userDetailsReducer = userDetailsSlice.reducer;
export const userUpdateProfileReducer = userUpdateProfileSlice.reducer;
export const userListReducer = userListSlice.reducer;
export const userDeleteReducer = userDeleteSlice.reducer;
export const userUpdateReducer = userUpdateSlice.reducer;
