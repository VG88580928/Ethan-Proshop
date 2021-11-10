/* 要在 node 裡用 import 寫法(ES module),記得在 package.json 加上 type="module" 讓這檔案能
 使用 ES module,不然 node 本來是用 Common JS 的寫法 => const express = require('express') */
import express from 'express';
import dotenv from 'dotenv'; //此套件可以在 .env 檔裡方便集中管理環境變數，分離敏感資訊，也避免變數不小心被共用到。
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// Routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
// .js 不像在 React 可以省略 一定要記得寫!!!

dotenv.config(); //執行後存放在 .env 的環境變數便會同步存放在 process.env.變數名稱 中

connectDB();

const app = express();

app.use(express.json()); // body parser => 讓 server 可以接收 req.body 內的 JSON data

// 當 server 收到 req,這個 req 會經過下面一連串的 middleware-chain,找到它該去的地方

// Application-level middleware
app.get('/', (req, res) => {
  res.send('API is running...');
});

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// Error-handling middleware
app.use(notFound); // 當 req 的 url 找不到時觸發

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV;

app.listen(
  5000,
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`)
);
