/* 要在 node 裡用 import 寫法(ES module),記得在 package.json 加上 type="module" 讓這檔案能
 使用 ES module,不然 node 本來都是用 Common JS 的寫法 => const express = require('express') */
import express from 'express';
import dotenv from 'dotenv'; //此套件可以在 .env 檔裡方便集中管理環境變數，分離敏感資訊，也避免變數不小心被共用到。
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// .js 不像在 React 可以省略 一定要記得寫!!!

dotenv.config(); //執行後存放在 .env 的環境變數便會同步存放在 process.env.變數名稱 中

connectDB();

const app = express();

app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);

// Error-handling middleware (當 req 的 url 找不到時觸發)
app.use(notFound);

// Error-handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

app.listen(
  5000,
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`)
);
