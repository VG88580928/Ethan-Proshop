import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension'; // 用來方便設置 Redux DevTools
import {
  requestProductsReducer,
  requestProductDetailsReducer,
} from './reducers/productReducers';
import { cartReducer } from './reducers/cartReducers';

// combine 所有 reducer
const reducer = combineReducers({
  requestProducts: requestProductsReducer,
  requestProductDetails: requestProductDetailsReducer,
  cart: cartReducer,
});

const initialState = {};

// 建立 store,引入 thunk 等 middleware
const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;
