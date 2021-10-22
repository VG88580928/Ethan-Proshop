import { CART_ADD_ITEMS, CART_REMOVE_ITEMS } from '../constants/cartConstants';

export const cartReducer = (state = { cartItems: [] }, action) => {
  switch (action.type) {
    case CART_ADD_ITEMS:
      const item = action.payload;

      const existItem = state.cartItems.find((e) => e._id === item._id);

      if (existItem) {
        return {
          ...state,
          cartItems: state.cartItems.map((e) => {
            return e._id === item._id ? (e.quantity += item.quantity) : e;
          }),
        };
      } else {
        return { ...state, cartItems: [...state.cartItems, item] };
      }

    default:
      return state;
  }
};
