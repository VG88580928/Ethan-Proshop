# Ethan-Proshop
> 這是一個使用 MongoDB、Express、React、Node(MERN) 架設，並部署在 Heroku 的購物網站。
* 此購物網站用戶分成 **一般用戶** & **管理員** 兩種，以管理員身分登入可以進入後台管理所有 **用戶**、**商品**、**訂單** 等等內容。

![首頁](https://i.imgur.com/qy3fqqc.png)

## 功能
* 響應式(RWD)網站設計
* 首頁高評價商品輪播(Carousel)
* 商品搜尋功能(有 auto-complete 功能)
* 商品以價格選單做價格排序
* 商品分頁(Paginator)
* 商品評論功能 (評價星數，商品留言等)
* 購物車系統
* 個人資料頁面可更改個人資訊、查看個人訂單狀態
* 使用者登入驗證與註冊(JWT)
* 結帳流程（運送地址、付款方式等）
* 以 PayPal、信用卡 等方式付款
* 管理員用戶管理
* 管理員商品管理
* 管理員訂單詳情頁面
* 管理員可標記訂單為已交付

## 使用技術
* 前端:
    - HTML5
    - CSS3
    - JavaScript (ES6)
    - Axios
    - React-Bootstrap
    - React + Redux(Redux Toolkit)
    - React Router
* 後端:
    - Node.js
    - Express.js
    - JWT
* 資料庫:
    - Mongoose/MongoDB atlas(多雲資料庫服務，省去載資料庫到電腦上，佈署也更方便，因為都是同一個資料庫)
* 部署:
    - Heroku (使用 Kaffeine 定時戳網站防止 idling)
