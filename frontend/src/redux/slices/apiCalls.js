import axios from 'axios';
import { addProduct } from './cartSlice';
import {
  loginRequest,
  loginSuccess,
  loginFail,
  registerRequest,
  registerSuccess,
  registerFail,
  detailsRequest,
  detailsSuccess,
  detailsFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
} from './userSlices';
import {
  orderCreateRequest,
  orderCreateSuccess,
  orderCreateFail,
} from './orderSlices';

// cart

// 這邊也是從 backend 拿商品資料，因為我們要確保按下加入購物車前 countInStock 的數量都是最新的狀態
export const addToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(`/api/products/${id}`);

  // 因為發現如果購物車內某商品已經存在，假設數量是 8，目前該商品庫存 11，假設我再回到商品頁面加 5 個同樣商品進去，購物車該商品會超過庫存量
  // 所以在這邊先檢查 localStorage 內有沒有存在同樣商品，有的話檢查 用戶在商品頁面的購買數量 + 購物車內該商品數量 是否超過庫存總量
  const cartProductsFromLocalStorage =
    JSON.parse(localStorage.getItem('cartProducts')) || [];
  const currentProduct = cartProductsFromLocalStorage.find((p) => {
    return id === p._id;
  });

  //如果現在 localStorage 無該商品，currentProduct 會是 undefined
  const checkCartProductQuantity = () => {
    if (currentProduct) {
      return currentProduct.quantity;
    } else {
      return 0;
    }
  };

  if (quantity + checkCartProductQuantity() <= data.countInStock) {
    dispatch(
      addProduct({
        _id: data._id, // 命名一定要符合 Schema 當初設計的 key,否則到時候這筆資料向後端請求操作 DB 的時候會出事
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        quantity,
      })
    );
  } else {
    alert('您的購物車該商品數加上您目前的購買數量已經超過庫存啦!!');
  }

  localStorage.setItem(
    'cartProducts',
    JSON.stringify(getState().cart.products) // getState() 回傳你的應用程式當下的 state tree。 等同於 store 的 reducer 最後一次回傳的值。
  );

  localStorage.setItem(
    'cartQuantity',
    JSON.stringify(getState().cart.quantity)
  );
};

// user

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch(loginRequest());

    // 登入時要把 token 放在 header 傳給 server (符合 JWT 格式)
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/users/login',
      { email, password },
      config
    );

    dispatch(loginSuccess(data));

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch(
      loginFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const register = (name, email, password) => async (dispatch) => {
  try {
    dispatch(registerRequest());

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const { data } = await axios.post(
      '/api/users',
      { name, email, password },
      config
    );

    dispatch(registerSuccess(data));
    dispatch(loginSuccess(data)); // 註冊完就登入

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch(
      registerFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const getUserDetails = (id) => async (dispatch, getState) => {
  try {
    dispatch(detailsRequest());

    const {
      userLogin: { userInfo },
    } = getState(); // 解構語法取得 userInfo 拿 token

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get(`/api/users/${id}`, config);

    dispatch(detailsSuccess(data));
  } catch (error) {
    dispatch(
      detailsFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const updateUserProfile = (user) => async (dispatch, getState) => {
  try {
    dispatch(updateProfileRequest());

    const {
      userLogin: { userInfo },
    } = getState(); // 解構語法取得 userInfo 拿 token

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put('/api/users/profile', user, config);

    dispatch(updateProfileSuccess(data));
    dispatch(detailsSuccess(data));
    dispatch(loginSuccess(data)); // 記得同時更新 userLogin，不然右上角的名字會是舊的

    localStorage.setItem('userInfo', JSON.stringify(data));
  } catch (error) {
    dispatch(
      updateProfileFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

// order
export const createOrder = (order) => async (dispatch, getState) => {
  try {
    dispatch(orderCreateRequest());

    console.log(order);

    const {
      userLogin: { userInfo },
    } = getState(); // 解構語法取得 userInfo 拿 token

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post('/api/orders', order, config);

    dispatch(orderCreateSuccess(data));
  } catch (error) {
    dispatch(
      orderCreateFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};
