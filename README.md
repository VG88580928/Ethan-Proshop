# Ethan-Proshop
> 這是一個使用 MongoDB、Express、React、Node(MERN) 架設，並部署在 Heroku 的購物網站。  
網站網址: https://ethan-proshop.herokuapp.com/
* 此購物網站用戶分成 **一般用戶** & **管理員** 兩種，以管理員身分登入可以進入後台管理所有 **用戶**、**商品**、**訂單** 等等內容。

![首頁](https://i.imgur.com/3SvnIRq.png)

## 功能
* 響應式(RWD)網站設計
* 首頁高評價商品輪播(Carousel)
* 商品搜尋功能(有 auto-complete 功能)
* 商品可使用價格選單做價格排序，可選擇商品種類過濾商品。
* 商品分頁(Paginator)
* 商品評論功能 (評價星數，商品留言等)
* 購物車系統
* 個人資料頁面可更改個人資訊、查看個人訂單狀態
* 使用者登入驗證與註冊(JWT)
* 結帳流程（運送地址、付款方式等）+ 建立商品訂單
* 以 PayPal、信用卡 等方式付款
* 管理員用戶管理
* 管理員商品管理
* 管理員訂單詳情頁面
* 管理員可將訂單標記為已交付

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
> 展示商品為舊版內容，目前網站商品已更新過

* 以直接搜尋商品做為範例

在搜尋欄輸入商品字首

![搜尋](https://i.imgur.com/u4pZWic.png)

查詢結果

![查詢結果](https://i.imgur.com/grClJ16.png)

點擊目標商品進入商品頁面，可直接輸入商品個數，然後點擊**加入購物車**

![商品頁面](https://i.imgur.com/chlHLYP.png)

網頁 title 會動態變化

![網名](https://i.imgur.com/cu1wHAe.png)

進入購物車頁面，點擊**去買單**後會導至登入頁面

![購物車頁面](https://i.imgur.com/dREyJRE.png)

登入頁面

![登入頁面](https://i.imgur.com/Bc3gdSy.png)

無會員進入註冊頁面註冊

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

### 評論功能

先進入商品頁面底下，評論前需先登入

![未登錄評論](https://i.imgur.com/r5Sb0k4.png)

登入後，先選擇評價分數

![評論1](https://i.imgur.com/kuBHYnP.png)

輸入評論

![評論2](https://i.imgur.com/PyTtJGY.png)

點選**提交**後，跳出成功提示及代表評論成功

![評論3](https://i.imgur.com/0Ui2kRA.png)

![評論4](https://i.imgur.com/992cNg2.png)

若之後重複留言同樣商品，則會跳出警告

![評論5](https://i.imgur.com/jNylrGl.png)

### 個人資料頁面

右上角點選**個人資料**

![個人資料](https://i.imgur.com/rBdc5Wm.png)

進入後左邊姓名信箱等會自動填入該用戶資訊，右邊可看見自己的訂單

![個人資料頁面](https://i.imgur.com/ZkxKF7x.png)

個人資料部分可以更改**姓名**、**信箱**及**密碼**，更改成功或失敗皆會跳出提示訊息

![個人資料提示](https://i.imgur.com/BVovGcc.png)

## 管理員後台介紹

從右上角分別進入各頁面

![管理員選單](https://i.imgur.com/gkJnsmE.png)

用戶列表頁面，可**編輯**及**刪除**用戶(無法編輯刪除自己)

![用戶列表頁面](https://i.imgur.com/c4Zw4Em.png)

![編輯用戶頁面](https://i.imgur.com/SqrstvT.png)

商品列表頁面，可**創建**、**編輯**及**刪除**商品

![商品列表頁面](https://i.imgur.com/XPiTMl1.png)

![編輯商品頁面](https://i.imgur.com/ILekRGw.png)

訂單列表頁面

![訂單列表頁面](https://i.imgur.com/grKRfUM.png)

若要出貨商品時，點選要出貨的訂單後面的`詳細`按鈕進入該訂單頁面

![訂單頁面](https://i.imgur.com/mlFdRCY.png)

點擊`標記為已配送`即完成出貨，此時商品庫存將會扣除

![訂單頁面](https://i.imgur.com/ra5ZHHa.png)

其餘更多細節部分，歡迎至 Demo 網站觀看：<https://ethan-proshop.herokuapp.com/>

## :art: Sources | 商品圖片來源

- [Unsplash](https://unsplash.com/)
- [羅技官網](https://www.logitech.com/zh-tw)
- [FiiO官網](https://www.fiio.com.tw/)




