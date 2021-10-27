import axios from 'axios';
import { addProduct } from './cartSlice';

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
        _id: data._id,
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
