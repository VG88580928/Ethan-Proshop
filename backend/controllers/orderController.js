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
      user: req.user._id, // 在 protect 解碼 token 取得的 user id
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    // 在把資料存進 DB 前，確保商品價格正確沒有被 user 串改
    for (let i = 0, l = order.orderItems.length; i < l; i++) {
      const product = await Product.findById(order.orderItems[i]._id);

      if (order.orderItems[i].price !== product.price) {
        order.orderItems[i].price = product.price;
      }
    }

    const createdOrder = await order.save(); // save() 和 create() 差別是 create() 是結合兩者 => instantiate new mongoose Model and save it

    res.status(201).json(createdOrder);
  }
});

export { addOrderItems };
