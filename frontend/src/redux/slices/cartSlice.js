// 由於 redux toolkit 內建 immer library, 所以在 reducer 內更新 state 時可以使用 'mutating' 的邏輯,
// 這並不會真的改變到 prevstate，而是 immer 幫我們在背後以此邏輯生成新的 immutable state
import { createSlice } from '@reduxjs/toolkit';

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    products: [],
    quantity: 0,
  },
  reducers: {
    addProduct: (state, action) => {
      const product = action.payload;
      const existProduct = state.products.find((e) => e._id === product._id);

      if (!existProduct) {
        state.quantity += 1; // 注意! 這邊是商品總類的數量，不是所有商品的總數
        state.products.push(action.payload);
      } else {
        const index = state.products.indexOf(existProduct); // 如果 existItem 存在，找到該 existItem 的 index，並更新該 existItem 的數量
        state.products[index].quantity += action.payload.quantity; // 個別商品總數
      }
    },
    removeProduct: (state, action) => {
      state.quantity -= 1;
      state.products = state.products.filter(
        (p) => p._id !== action.payload.id
      );

      localStorage.setItem('cartProducts', JSON.stringify(state.products)); // 記得刪完 state 裡的 product後，也要更新 localStorage
      localStorage.setItem('cartQuantity', JSON.stringify(state.quantity));
    },
  },
});

// each case under reducers becomes an action creater
// 自動生成 action types (例如 addProduct 這個 action creater 會自動生成 'cart'(cartSlice.name) + '/' + 'addProduct'(addProduct.name) = 'cart/addProduct' 這個 action type)
export const { addProduct, removeProduct } = cartSlice.actions;
export default cartSlice.reducer;
