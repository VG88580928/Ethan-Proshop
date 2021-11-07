import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @描述: Auth user(身分驗證)) & get token   注意: authentication(身份驗證) and authorization(授權) 是兩個不同東西
// @route: POST /api/users/login
// @使用權: Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }); // 查找是否有該特定的 user document

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id), // 發送 token 讓 user 可以訪問 private routes
    });
  } else {
    res.status(401);
    throw new Error('帳號或密碼錯誤');
  }
});

// @描述: 註冊新用戶
// @route: POST /api/users
// @使用權: Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email }); // 查找是否有該特定的 user document(是否有人註冊過這個 email 了)

  if (userExists) {
    res.status(400); // HTTP 400 Bad Request
    throw new Error('帳號已被使用過囉');
  }

  const user = await User.create({ name, email, password }); // create 前自動執行 pre('save')加密密碼，因為 create 是 save 的語法糖

  // 回傳和登入時一樣的 object,註冊完可以立刻驗證
  if (user) {
    // HTTP 201 表示有東西被創建了
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin, // 當初 Schema 有設置 default 為 false(剛註冊為一般用戶)
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @描述: GET user profile
// @route: GET /api/users/profile
// @使用權: Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = req.user; // 在 protect middleware 裡建立好的 req.user

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin, // 這邊不用再丟 token 回去了(登入的時候丟就好)
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @描述: Update user profile
// @route: PUT /api/users/profile
// @使用權: Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name; // 如果用戶沒改名字就保持原本
    user.email = req.body.email || user.email;
    user.password = req.body.password || user.password;

    const updatedUser = await user.save(); // update a document with Mongoose.(save 會自動觸發執行 userSchema.pre 函式加密密碼)

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export { authUser, registerUser, getUserProfile, updateUserProfile };
