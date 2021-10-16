// 此檔案用來快速 insert 資料進 DB，也可清空 DB，幫助我們再開發初期做測試
// 等到 DB 有更多產品、訂單等時就必須非常小心使用，因為執行這邊任何一個功能要馬清空 DB
// ，要馬資料全部被替代掉

import mongoose from 'mongoose';
import dotenv from 'dotenv'; // 這檔案是完全分離的，無法連結 server，搜不到 .env,所以需要再 import 一次
import users from './data/users.js';
import products from './data/products.js';
import User from './models/userModel.js';
import Product from './models/productModel.js';
import Order from './models/orderModel.js';
import connectDB from './config/db.js';

dotenv.config();

connectDB();

const importData = async () => {
  try {
    // 先清空 DB
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();

    const createUsers = await User.insertMany(users); // insert data to DB
    const adminUser = createUsers[0]._id;

    // 把 adminUser 資訊放進當前 products
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    await Product.insertMany(sampleProducts);

    console.log('Data imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

// 清空 DB ，可以想成是 reset button，幫助測試。
const destroyData = async () => {
  try {
    // 清空 DB
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();

    console.log('Data Destroyed!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

/* process.argv[index] 舉例: node process-args.js one two=three four
0: /usr/local/bin/node
1: /Users/mjr/work/node/process-args.js
2: one   etc...*/
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
