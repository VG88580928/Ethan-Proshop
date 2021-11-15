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

// 把 data 資料夾預先寫好的 users & products 資料打進 DB 做測試
const importData = async () => {
  try {
    // 先清空 DB
    await Order.deleteMany();
    await User.deleteMany();
    await Product.deleteMany();

    const createUsers = await User.insertMany(users); // insert users data to DB
    const adminUser = createUsers[0]._id; // users data 第一筆是管理員，存取管理員 id

    // 把 adminUser 資訊放進當前 products,表示這些商品由此管理員所創建
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

/* process.argv[index] 舉例:在終端上寫 -> node process-args.js one two=three four
process.argv[0] 回傳 /usr/local/bin/node
process.argv[1] 回傳 /Users/mjr/work/node/process-args.js
process.argv[2] 回傳 one   
process.argv[3] 回傳 two=three
etc...*/
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
