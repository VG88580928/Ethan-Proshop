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
    - React-Bootstrap + Bootstrap 5
    - React (17) + Redux(Redux Toolkit)
    - React Router (5.3) 
* 後端:
    - Node.js (16.10.0)
    - Express.js (4.17.1)
    - JWT
* 資料庫:
    - Mongoose/MongoDB atlas(多雲資料庫服務，省去載資料庫到電腦上，佈署也更方便，因為都是同一個資料庫)
* 部署:
    - Heroku (使用 Kaffeine 定時戳網站防止 idling)

## 購物流程展示
* 以直接搜尋商品做為範例

在搜尋欄輸入商品字首

![搜尋](https://i.imgur.com/u4pZWic.png)

查詢結果

![查詢結果](https://i.imgur.com/grClJ16.png)

點擊目標商品進入商品頁面，可直接輸入商品個數

![商品頁面](https://i.imgur.com/chlHLYP.png)

網頁 title 會動態變化

![網名](https://i.imgur.com/cu1wHAe.png)

點擊**加入購物車**後進入購物車頁面

![購物車頁面](https://i.imgur.com/dREyJRE.png)

點擊**去買單**後導至登入頁面

![登入頁面](https://i.imgur.com/Bc3gdSy.png)

無會員進入註冊頁面

![註冊頁面](https://i.imgur.com/mO8p0qN.png)

登入或註冊完後都會直接導至運送資料填寫頁面

![運送頁面](https://i.imgur.com/UDd7NQ4.png)

選擇付款方式 (目前只有一項，未來可擴充)

![付款方式頁面](https://i.imgur.com/8q7i8b0.png)

創建訂單頁面，點擊**創建訂單** (創完訂單後會清空購物車內容)

![創建訂單頁面](https://i.imgur.com/346NZQt.png)

創建完訂單，可以看見訂單的**運送**及**付款**狀態

![訂單資訊頁面](https://i.imgur.com/iMA1UZI.png)

以 paypal 付款做舉例，點選 paypal 按鈕

![paypal 頁面](https://i.imgur.com/PFeNW6i.png)

點擊 **pay now** 後，訂單付款狀態會顯示已付款

![訂單資訊頁面](https://i.imgur.com/YHCG9n4.png)
