const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);

  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // 防止有時出現 error 也回傳 status 200

  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack, // 處於開發階段時才回傳 stack 資訊
  });
};

export { notFound, errorHandler };
