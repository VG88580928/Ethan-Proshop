import { configureStore } from '@reduxjs/toolkit'; // 引入 redux toolkit ,它具有向後兼容性(不用重寫現有代碼)
import {
  requestProductsReducer,
  requestProductDetailsReducer,
} from './reducers/productReducers';
// import { cartReducer } from './reducers/cartReducers';
import {
  productDeleteReducer,
  productCreateReducer,
  productUpdateReducer,
  productReviewCreateReducer,
  productTopRatedReducer,
  productCategoryReducer,
} from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import {
  userLoginReducer,
  userRegisterReducer,
  userDetailsReducer,
  userUpdateProfileReducer,
  userListReducer,
  userDeleteReducer,
  userUpdateReducer,
} from './slices/userSlices';
import {
  orderCreateReducer,
  orderDetailsReducer,
  orderPayReducer,
  myOrderListReducer,
  orderListReducer,
  orderDeliverReducer,
} from './slices/orderSlices';

const cartProductsFromLocalStorage = localStorage.getItem('cartProducts')
  ? JSON.parse(localStorage.getItem('cartProducts'))
  : [];

const cartQuantityFromLocalStorage = localStorage.getItem('cartProducts')
  ? JSON.parse(localStorage.getItem('cartQuantity'))
  : 0;

const userInfoFromLocalStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const shippingAddressFromLocalStorage = localStorage.getItem('shippingAddress')
  ? JSON.parse(localStorage.getItem('shippingAddress'))
  : {};

const paymentMethodFromLocalStorage = localStorage.getItem('paymentMethod')
  ? JSON.parse(localStorage.getItem('paymentMethod'))
  : '';

const initialState = {
  cart: {
    products: cartProductsFromLocalStorage,
    quantity: cartQuantityFromLocalStorage,
    shippingAddress: shippingAddressFromLocalStorage,
    paymentMethod: paymentMethodFromLocalStorage,
  },
  userLogin: { userInfo: userInfoFromLocalStorage },
};

// 取代 createStore，已經內建好 thunk,redux-devtools-extension等 middleware 了，(applyMiddleware(),combineReducers() 等等都不需要了)
const store = configureStore({
  reducer: {
    requestProducts: requestProductsReducer,
    requestProductDetails: requestProductDetailsReducer,
    productCategory: productCategoryReducer,
    productCreate: productCreateReducer,
    productDelete: productDeleteReducer,
    productUpdate: productUpdateReducer,
    productReviewCreate: productReviewCreateReducer,
    productTopRated: productTopRatedReducer,
    cart: cartReducer,
    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userUpdate: userUpdateReducer,
    userDelete: userDeleteReducer,
    orderCreate: orderCreateReducer,
    orderDetails: orderDetailsReducer,
    orderPay: orderPayReducer,
    myOrderList: myOrderListReducer,
    orderList: orderListReducer,
    orderDeliver: orderDeliverReducer,
  },
  preloadedState: initialState, // 這裡放之前的 initialState
});

export default store;

// ----- 做到一半時原本 Redux 的版本 ------

// import { combineReducers } from 'redux';
// import thunk from 'redux-thunk';
// import { composeWithDevTools } from 'redux-devtools-extension'; // 用來方便設置 Redux DevTools
// import {
//   requestProductsReducer,
//   requestProductDetailsReducer,
// } from './reducers/productReducers';
// import { cartReducer } from './reducers/cartReducers';

// combine 所有 reducer
// const rootReducer = combineReducers({
//   requestProducts: requestProductsReducer,
//   requestProductDetails: requestProductDetailsReducer,
//   cart: cartReducer,
// });

// const initialState = {};

// 建立 store,引入 thunk 等 middleware
// const store = createStore(
//   reducer,
//   initialState,
//   composeWithDevTools(applyMiddleware(thunk))
// );

// 合併參考: https://www.codecademy.com/courses/learn-redux/lessons/the-redux-toolkit/exercises/converting-the-store-to-use-configurestore
