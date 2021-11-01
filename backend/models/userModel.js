import mongoose from 'mongoose';
import bycrpt from 'bcryptjs';

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

// 建立 matchPassword 自定義方法，注意這邊不要用 arrow function,因為 this 會沒有 parent object 可以指向
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bycrpt.compare(enteredPassword, this.password); // 若帳密正確，this 會指向那個特定的 user document，可存取 password、name...等等
};

//預先把純文字的密碼 encrypt (因為 create 是 save的語法糖，所以註冊 create 的時候這裡會自動執行)
userSchema.pre('save', async function () {
  // 因為在更改用戶資訊時不會更改到密碼，所以要跳過該步驟，不然又生成一個新的 hash password 用戶就不能登入啦!
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bycrpt.genSalt(10); // generate salt 加鹽數值越高越安全但相對的加密時間就越長。
  this.password = await bycrpt.hash(this.password, salt);
});

// model() 把 Schema 編譯成 Model，Model 可以用來創建以及操作 Mongo 的 collections
// (此處創建名為 users 的 collection)
const User = mongoose.model('User', userSchema);

export default User;
