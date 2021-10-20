import axios from 'axios';
import {
  REQUEST_PRODUCTS_SUCCESS,
  REQUEST_PRODUCTS_FAIL,
  REQUEST_PRODUCT_DETAILS_SUCCESS,
  REQUEST_PRODUCT_DETAILS_FAIL,
} from '../constants/productConstants';

// 有了 thunk middleware，就能在 function 中間 dispatch 了
export const requestProducts = () => async (dispatch) => {
  try {
    // dispatch({ type: REQUEST_PRODUCTS_PENDING });
    const { data } = await axios.get('/api/products'); // axios 會自動轉換json，所以不用像 fetch API 需要多一步 const data = await res.json()
    dispatch({
      type: REQUEST_PRODUCTS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REQUEST_PRODUCTS_FAIL,
      payload:
        // https://axios-http.com/zh/docs/handling_errors 寫法參考 axios doc
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const requestProductDetails = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/products/${id}`);
    dispatch({
      type: REQUEST_PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: REQUEST_PRODUCT_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
