import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler'; // 參數有 next 也會幫我們在最後面自動執行 next()
import User from '../models/userModel.js';

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

export { protect };
