import mongoose from 'mongoose';
// Mongoose 可以想成是 MongoDB 和 node 之間的 middleware，
// 會追蹤在與 DB 連線前對資料庫進行的請求，並在連線後加以執行。

// 與 MongoDB 建立連線
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    /* mongoose 6之後第二參數的一些選項已經不用設定了(useNewUrlParser, useUnifiedTopology,useCreateIndex...)
    (https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options)*/

    console.log(`MongoDB Connected:　${mongoose.connection.host}`);
  } catch (error) {
    console.log(`error ${error}`);
    process.exit(1);
  }
};

export default connectDB;
