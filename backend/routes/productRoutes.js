import express from 'express';
import asyncHandler from 'express-async-handler'; //讓我們不用一直重複寫 try-catch 原理:https://stackoverflow.com/questions/67404243/how-does-this-asynchandler-function-work(回答二樓)
import Product from '../models/productModel.js';

const router = express.Router(); //creates a new router object

// Router-level middleware

// @描述: 獲取所有商品
// @route: GET /api/products
// @使用權: Public
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const products = await Product.find({});

    res.json(products); // 轉為 json 格式作為 response 送出
  })
);

// @描述: 獲取單一商品
// @route: GET /api/products/:id
// @使用權: Public
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error('查無商品');
    }
  })
);

export default router;
