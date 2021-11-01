import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // 參數 1:payload:可放入可以辨認使用者的資訊(如 id),但千萬不要把敏感的資料放在 token 中
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d', // 30 日到期
  });
};

export default generateToken;
