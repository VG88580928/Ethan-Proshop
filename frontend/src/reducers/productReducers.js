import {
  REQUEST_PRODUCTS_SUCCESS,
  REQUEST_PRODUCTS_FAIL,
  REQUEST_PRODUCT_DETAILS_SUCCESS,
  REQUEST_PRODUCT_DETAILS_FAIL,
} from '../constants/productConstants';

// (previousState, action) => newState  必須是 pure function (所以要避免 Math.random()、Date.now() 等常見方法)

export const requestProductsReducer = (state = { products: [] }, action) => {
  switch (action.type) {
    // case REQUEST_PRODUCTS_PENDING:
    //   return { ...state, isPending: true };
    case REQUEST_PRODUCTS_SUCCESS:
      return { ...state, products: action.payload };
    case REQUEST_PRODUCTS_FAIL:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

export const requestProductDetailsReducer = (
  state = { product: { reviews: [] } },
  action
) => {
  switch (action.type) {
    case REQUEST_PRODUCT_DETAILS_SUCCESS:
      return { ...state, product: action.payload };
    case REQUEST_PRODUCT_DETAILS_FAIL:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
