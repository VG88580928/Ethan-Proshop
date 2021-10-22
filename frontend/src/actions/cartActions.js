import axios from 'axios';
import { CART_ADD_ITEMS } from '../constants/cartConstants';

// 本來想說產品資料直接從 redux store 裡拿就好(畢竟剛進網站首頁全部產品就都載入完了)，但這忽略了使用者可能會
// 不經過首頁，直接進入特定商品頁面，這樣他們就會看不到商品，故這邊也是從 backend 拿商品資料
export const cartAddItems

