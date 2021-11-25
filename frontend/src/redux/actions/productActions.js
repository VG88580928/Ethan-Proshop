import axios from 'axios';
import {
  REQUEST_PRODUCTS_PENDING,
  REQUEST_PRODUCTS_SUCCESS,
  REQUEST_PRODUCTS_FAIL,
  REQUEST_PRODUCT_DETAILS_PENDING,
  REQUEST_PRODUCT_DETAILS_SUCCESS,
  REQUEST_PRODUCT_DETAILS_FAIL,
} from '../constants/productConstants';

// 有了 thunk middleware，就能在 function 中間 dispatch 了
export const requestProducts =
  (keyword = '') =>
  async (dispatch) => {
    try {
      dispatch({ type: REQUEST_PRODUCTS_PENDING });

      const { data } = await axios.get(`/api/products?keyword=${keyword}`); // axios 會自動轉換json，所以不用像 fetch API 需要多一步 const data = await res.json()

      dispatch({
        type: REQUEST_PRODUCTS_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: REQUEST_PRODUCTS_FAIL,
        payload:
          // https://axios-http.com/zh/docs/handling_errors 寫法可參考 axios doc
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

// 本來想說產品資料直接從 redux store 裡拿就好(畢竟剛進網站首頁全部產品就都載入完了)，但這忽略了使用者可能會
// 不經過首頁，直接進入特定商品頁面，這樣他們就會看不到商品，故這邊也是從 backend 拿商品資料
export const requestProductDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: REQUEST_PRODUCT_DETAILS_PENDING });

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
