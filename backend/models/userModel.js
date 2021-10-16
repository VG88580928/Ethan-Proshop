import mongoose from 'mongoose';

// schema 是用 JSON 的方式來告訴 mongo 說 document 的資料會包含哪些型態。
// schema 會自動生成 unique id
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false, // 因為用戶剛註冊時不會是admin，而是一般用戶
    },
  },
  {
    timestamps: true,
  }
);

// model() 把 Schema 編譯成 Model，Model 可以用來創建以及操作 Mongo 的 collections
// (此處創建名為 users 的 collection)
const User = mongoose.model('User', userSchema);

export default User;
