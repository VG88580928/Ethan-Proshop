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

  const user = await User.create({ name, email, password }); // create 前自動執行 pre('save')加密密碼，因為 create 是 save 的語法糖(實例化 model 並存進 DB)

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
      isAdmin: user.isAdmin, // 這邊不用再丟 token 回去了(登入 & 修改個資 的時候丟就好)
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
    user.password = req.body.password || user.password; // 這裡的 req.body.password 還沒被加密，待會 save() 進 DB 前會先加密，但如果用戶更改資料時沒改密碼，這個本來的 user.password 進 DB 之前還是會再被加密一次，不知道這會不會有甚麼問題

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

// @描述: GET all users (Admin only)
// @route: GET /api/users
// @使用權: Private/Admin
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}); // 找到所有商品   也可以直接 find()，意思一樣

  res.json(users);
});

// @描述: DELETE user (Admin only)
// @route: DELETE /api/users/:id   (以 id 來刪除該特定 user)
// @使用權: Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  // findOneAndRemove() 可以直接找到 user 並刪除，但我這邊選擇先 findById() 再 remove() 的原因是因為這樣我就可以在 remove() 之前再多做一些額外的檢查
  const user = await User.findById(req.params.id); // 找到要刪除的 user

  if (user) {
    await user.remove(); // 刪除用戶
    res.json({ message: '用戶已刪除' });
  } else {
    res.status(404);
    throw new Error('查無此用戶');
  }
});

// @描述: GET user by ID (Admin only)
// @route: GET /api/users/:id
// @使用權: Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password'); // 用 url 上後面的 id 找到 user

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('查無此用戶');
  }
});

// @描述: Update user (Admin only)
// @route: PUT /api/users/:id
// @使用權: Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name; // 如果用戶沒改名字就保持原本
    user.email = req.body.email || user.email;
    user.isAdmin = req.body.isAdmin ?? user.isAdmin; // 這裡不可以寫成 req.body.isAdmin || user.isAdmin; 這樣的話管理員會沒辦法把其他管理員變回一般用戶(因為 req.body.isAdmin 為 false 時，經過 || 會回傳 user.isAdmin，這樣 user.isAdmin 永遠都會是原本的 true)，所以用 Nullish operator(只擋 null 或 undefined) 改寫，讓左邊可以吃到 false 的值

    const updatedUser = await user.save(); // update a document with Mongoose.(save 會自動觸發執行 userSchema.pre 函式加密密碼)

    // 沒有提供管理員改密碼功能，就不回傳新 token 了
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
};
