/* 要在 node 裡用 import 寫法(ES module),記得在 package.json 加上 type="module" 讓這檔案能
 使用 ES module,不然 node 本來是用 Common JS 的寫法 => const express = require('express') */
import path from 'path';
import pkg from 'cloudinary';
import express from 'express';
import dotenv from 'dotenv'; //此套件可以在 .env 檔裡方便集中管理環境變數，分離敏感資訊，也避免變數不小心被共用到。
import morgan from 'morgan'; // 可以在接收 req 時在終端顯示 req 資訊，以及 res 狀態等等
import connectDB from './config/db.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
// Routes
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
// .js 不像在 React 可以省略 一定要記得寫!!!

dotenv.config(); // 執行後存放在 .env 的環境變數便會同步存放在 'process.env.變數名稱' 中

const cloudinary = pkg; // cloudinary 不支援 es6 modules，所以需要多一個步驟 => 存進一個變數

connectDB(); // 連結 DB

const app = express();

// app.use(Middleware) 的詳細介紹 https://stackoverflow.com/questions/11321635/nodejs-express-what-is-app-use/11321828#11321828

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json()); // body parser => 讓 server 可以接收 req.body 內的 JSON data

// cloudinary 基本設置
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
  // secure: true 記得寫，不然打上去的圖片會是 http 而不是 https
  secure: true,
});

// 當 server 收到 req,這個 req 會經過下面一連串的 middleware-chain，找到它該去的地方

// Application-level middleware
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/config/paypal', (req, res) =>
  res.send(process.env.PAYPAL_CLIENT_ID)
);

// const __dirname = path.resolve();
// app.use('/uploads', express.static(path.join(__dirname, '/uploads'))); // 如果圖片要放 local 直接上傳網上，需要把該資料夾轉為 static folder(現在放圖片放雲端了所以不需要)

const __dirname = path.resolve(); // 當前資料夾位置
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/frontend/build')));

  // '*' 表示除了上面那些 API 的 route 以外的任何端口，回傳 build 裡的 index.html
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

// Error-handling middleware
app.use(notFound); // 當 req 的 url 找不到時觸發

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
