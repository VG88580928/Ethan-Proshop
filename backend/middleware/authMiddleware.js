import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'; // 參數有 next 也會幫我們在最後面自動執行 next()
import User from '../models/userModel.js';

// protect middleware: 確保使用者 req 打進 protected route 之前都有攜帶 token，並解碼 token 取得 user id 後從 DB 獲取該 user's document，並放到 req.user 裡
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer') // startsWith() 默認搜尋開頭字串，有則回傳 true,第二參數為搜尋字串位置(可選)
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]; // 把 Bearer 這個 convention 去掉

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password'); // 這邊可以不用拿密碼

      next(); // 執行下個 middleware
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401); // 401 Unauthorized
    throw new Error('Not authorized,no token');
  }
});

// admin middleware: 確保這些 req 都是 '已登入的 admin' 發出的
const admin = (req, res, next) => {
  // 確認使用者已登入且為 admin
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401); // 401 未經授權
    throw new Error('not authorized as an admin');
  }
};

export { protect, admin };
