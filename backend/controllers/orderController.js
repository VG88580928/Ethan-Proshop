// to improve the security level of order creation in the backend we can have this code :

// for(let i=0; i < order.orderItems.length; i++) {

//   const product = await Product.findById(order.orderItems[i].product);

//   order.orderItems[i].price = product.price

// }

// after this line:

// https://github.com/bradtraversy/proshop_mern/blob/master/backend/controllers/orderController.js#L23
import asyncHandler from 'express-async-handler'; //讓我們不用一直重複寫 try-catch (Express 5.0 alpha 版本不需要) 原理:https://stackoverflow.com/questions/67404243/how-does-this-asynchandler-function-work(回答二樓)
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

// @描述: 創建新訂單
// @route: POST /api/orders
// @使用權: Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    taxPrice,
    totalPrice,
  } = req.body;

  // 多檢查 orderItems 以防可能接收到它的值為 null or undefined，不然會出現很醜的 error
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items');
    return;
  } else {
    // instantiate new order
    const order = new Order({
      orderItems,
      user: req.user._id, // 在 protect middleware 解碼 token 取得的 user id
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    // 在把資料存進 DB 前，確保商品價格正確沒有被 user 串改 ()
    for (let i = 0, l = order.orderItems.length; i < l; i++) {
      const product = await Product.findById(order.orderItems[i]._id);

      if (order.orderItems[i].price !== product.price) {
        order.orderItems[i].price = product.price;
      }
    }
    // 目前 itemsPrice & shippingPrice & taxPrice & totalPrice 都還有被串改可能，如果要保持購物車商品放在 local storage 裡，目前我想的到的方法都必須多次查詢資料庫，也需要在 controller 內做多次運算，很耗效能，所以此安全性問題暫時先擱置。

    const createdOrder = await order.save(); // save() 和 create() 差別是 create() 是結合兩者 => instantiate new mongoose Model and save it

    res.status(201).json(createdOrder);
  }
});

// @描述: GET order by order ID
// @route: GET /api/orders/:id
// @使用權: Private
const getOrderById = asyncHandler(async (req, res) => {
  // 順便利用 populate() 取得與該 order 相關聯的 user document 內的 name 和 email,這裡的第一個參數 'user' 是當初在 Order model schema 中第一個 property 'user',利用這個從 User schema 引用來的 user id 獲得該 user document 資訊
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  // 確認存在訂單且用戶要馬是 admin，要馬是一般用戶，否則不回傳訂單
  // 這邊檢查訂單是否為該用戶時如果寫 order.user._id === req.user._id 會不如預期(因為我們比較的是 ObjectID，用 == or === 比較物件會有 reference 問題)
  // 解法參考: https://stackoverflow.com/questions/11060213/mongoose-objectid-comparisons-fail-inconsistently  &&  http://mongodb.github.io/node-mongodb-native/api-bson-generated/objectid.html#equals (equals 方法)
  // 更新第 2 種解法: 使用 toString()
  // 參考: https://docs.mongodb.com/manual/reference/method/ObjectId.toString/
  if (order && (req.user.isAdmin || order.user._id.equals(req.user._id))) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error('查無此訂單');
  }
});

// @描述: Update order to paid
// @route: PUT /api/orders/:id/pay
// @使用權: Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  // FIXME: 發現此路由的安全性風險: user 可以不經過付款就讓 order 變成 isPaid
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // paymentResult 存取 Paypal API 回傳的結果
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error('查無此訂單');
  }
});

// @描述: Update order to delivered (Admin only)
// @route: PUT /api/orders/:id/deliver
// @使用權: Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);

    // 配送之後更新個別商品庫存
    for (let item of order.orderItems) {
      let qty = item.quantity;

      let product = await Product.findById(item._id);

      product.countInStock -= qty;

      // FIXME: 避免庫存變成負值，但這邊不能再用 else 丟錯誤 res 了，因為前面已經丟過 res 了，目前還想不到怎麼丟 error res 會比較好。(但這功能似乎也沒必要，畢竟賣家要是沒貨 or 貨不夠也不會沒發貨就去按已配送按鈕)
      // 相同案例: https://stackoverflow.com/questions/65273205/how-can-i-handle-multiple-response-in-single-route
      if (product.countInStock >= 0) {
        await product.save();
      }
    }
  } else {
    res.status(404);
    throw new Error('查無此訂單');
  }
});

// @描述: GET logged in user orders
// @route: GET /api/orders/myorders
// @使用權: Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }); // 用該 user id 來找到他所擁有的全部 orders
  res.json(orders);
});

// @描述: GET all orders (Admin only)
// @route: GET /api/orders
// @使用權: Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate('user', 'name');
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
};
