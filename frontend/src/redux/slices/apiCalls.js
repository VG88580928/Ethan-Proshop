import axios from 'axios';
import { REQUEST_PRODUCT_DETAILS_SUCCESS } from '../constants/productConstants';
import {
  productDeleteRequest,
  productDeleteSuccess,
  productDeleteFail,
  productCreateRequest,
  productCreateSuccess,
  productCreateFail,
  productUpdateRequest,
  productUpdateSuccess,
  productUpdateFail,
  productReviewCreateRequest,
  productReviewCreateSuccess,
  productReviewCreateFail,
  productTopRatedRequest,
  productTopRatedSuccess,
  productTopRatedFail,
} from './productSlice';
import { addProduct, cartReset } from './cartSlice';
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
  userListRequest,
  userListSuccess,
  userListFail,
  userDeleteRequest,
  userDeleteSuccess,
  userDeleteFail,
  userUpdateRequest,
  userUpdateSuccess,
  userUpdateFail,
} from './userSlices';
import {
  orderCreateRequest,
  orderCreateSuccess,
  orderCreateFail,
  orderDetailsRequest,
  orderDetailsSuccess,
  orderDetailsFail,
  orderPayRequest,
  orderPaySuccess,
  orderPayFail,
  orderDeliverRequest,
  orderDeliverSuccess,
  orderDeliverFail,
  myOrderListRequest,
  myOrderListSuccess,
  myOrderListFail,
  orderListRequest,
  orderListSuccess,
  orderListFail,
} from './orderSlices';

// product
export const deleteProduct = (productId) => async (dispatch, getState) => {
  try {
    dispatch(productDeleteRequest());

    const {
      userLogin: { userInfo },
    } = getState(); // 解構語法取得 userInfo 拿 token

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/products/${productId}`, config);

    dispatch(productDeleteSuccess());
  } catch (error) {
    dispatch(
      productDeleteFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const createProduct = (productId) => async (dispatch, getState) => {
  try {
    dispatch(productCreateRequest());

    const {
      userLogin: { userInfo },
    } = getState(); // 解構語法取得 userInfo 拿 token

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.post(`/api/products`, {}, config);

    dispatch(productCreateSuccess(data));
  } catch (error) {
    dispatch(
      productCreateFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const updateProduct = (product) => async (dispatch, getState) => {
  try {
    dispatch(productUpdateRequest());

    const {
      userLogin: { userInfo },
    } = getState(); // 解構語法取得 userInfo 拿 token

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/products/${product._id}`,
      product,
      config
    );

    dispatch(productUpdateSuccess(data));

    // 記得更新完商品資訊要更新 productDetails，不然當你更新完某商品後，再次回到該商品編輯頁面時，還會是舊的資訊
    dispatch({
      type: REQUEST_PRODUCT_DETAILS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch(
      productUpdateFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const creatProductReview =
  (productId, review) => async (dispatch, getState) => {
    try {
      dispatch(productReviewCreateRequest());

      const {
        userLogin: { userInfo },
      } = getState(); // 解構語法取得 userInfo 拿 token

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post(`/api/products/${productId}/reviews`, review, config);

      dispatch(productReviewCreateSuccess());
    } catch (error) {
      dispatch(
        productReviewCreateFail(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        )
      );
    }
  };

export const requestTopRatedProducts = () => async (dispatch) => {
  try {
    dispatch(productTopRatedRequest());

    const { data } = await axios.get('/api/products/top');

    dispatch(productTopRatedSuccess(data));
  } catch (error) {
    dispatch(
      productTopRatedFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

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
        _id: data._id, // 命名一定要符合 Schema 當初設計的 key,否則到時候這筆資料向後端請求操作 DB 的時候會出事(例如建立商品訂單時)
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

    dispatch(updateProfileSuccess(data)); // 這邊也許不用帶 data 進來(好像沒用到這筆資料)
    dispatch(detailsSuccess(data)); // 改完個人資料後把舊資料更新成新的
    dispatch(loginSuccess(data)); // 記得同時更新 userLogin，不然右上角的名字會是舊的

    localStorage.setItem('userInfo', JSON.stringify(data)); // server 會生成新的 token，所以這邊 token 也會更新
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

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch(userListRequest());

    const {
      userLogin: { userInfo },
    } = getState(); // 解構語法取得 userInfo 拿 token

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get('/api/users', config);

    dispatch(userListSuccess(data));
  } catch (error) {
    dispatch(
      userListFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const deleteUser = (userId) => async (dispatch, getState) => {
  try {
    dispatch(userDeleteRequest());

    const {
      userLogin: { userInfo },
    } = getState(); // 解構語法取得 userInfo 拿 token

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    await axios.delete(`/api/users/${userId}`, config);

    dispatch(userDeleteSuccess());
  } catch (error) {
    dispatch(
      userDeleteFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const updateUser = (user) => async (dispatch, getState) => {
  try {
    dispatch(userUpdateRequest());

    const {
      userLogin: { userInfo },
    } = getState(); // 解構語法取得 userInfo 拿 token

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(`/api/users/${user._id}`, user, config);

    dispatch(userUpdateSuccess());
    dispatch(detailsSuccess(data)); // 改完個人資料後把舊資料更新成新的，不然改完後用戶編輯畫面還是舊的資料
  } catch (error) {
    dispatch(
      userUpdateFail(
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
    dispatch(cartReset()); // 創建訂單的同時清空購物車(和local storage)
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

export const getOrderDetails = (orderId) => async (dispatch, getState) => {
  try {
    dispatch(orderDetailsRequest());

    const {
      userLogin: { userInfo },
    } = getState(); // 解構語法取得 userInfo 拿 token

    // GET req 不需要 Content-Type
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    // 從 DB 中獲取訂單，方便之後 admin 可以將它們標記為已交付等等。
    const { data } = await axios.get(`/api/orders/${orderId}`, config);

    dispatch(orderDetailsSuccess(data));
  } catch (error) {
    dispatch(
      orderDetailsFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const payOrder =
  (orderId, paymentResult) => async (dispatch, getState) => {
    try {
      dispatch(orderPayRequest());

      const {
        userLogin: { userInfo },
      } = getState(); // 解構語法取得 userInfo 拿 token

      // GET req 不需要 Content-Type
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.put(
        `/api/orders/${orderId}/pay`,
        paymentResult,
        config
      );

      dispatch(orderPaySuccess(data));
    } catch (error) {
      dispatch(
        orderPayFail(
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        )
      );
    }
  };

export const deliverOrder = (orderId) => async (dispatch, getState) => {
  try {
    dispatch(orderDeliverRequest());

    const {
      userLogin: { userInfo },
    } = getState(); // 解構語法取得 userInfo 拿 token

    // GET req 不需要 Content-Type
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.put(
      `/api/orders/${orderId}/deliver`,
      {},
      config
    );

    dispatch(orderDeliverSuccess(data));
  } catch (error) {
    dispatch(
      orderDeliverFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const listMyOrders = () => async (dispatch, getState) => {
  try {
    dispatch(myOrderListRequest());

    const {
      userLogin: { userInfo },
    } = getState(); // 解構語法取得 userInfo 拿 token

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get('/api/orders/myorders', config);

    dispatch(myOrderListSuccess(data));
  } catch (error) {
    dispatch(
      myOrderListFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};

export const listOrders = () => async (dispatch, getState) => {
  try {
    dispatch(orderListRequest());

    const {
      userLogin: { userInfo },
    } = getState(); // 解構語法取得 userInfo 拿 token

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get('/api/orders', config);

    dispatch(orderListSuccess(data));
  } catch (error) {
    dispatch(
      orderListFail(
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      )
    );
  }
};
