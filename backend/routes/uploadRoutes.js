import path from 'path'; // from Node.js
import express from 'express';
import pkg from 'cloudinary';
import asyncHandler from 'express-async-handler';
import multer from 'multer'; // multer 幫助我們上傳文件到 server
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const cloudinary = pkg; // cloudinary 不支援 es6 modules，所以需要多一個步驟 => 存進一個變數

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/'); // 把圖片上傳 cloud 之前的暫存資料夾(uploads)
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}` // Date.now(): 為了防止有別人命名了同名檔案  path.extname(): 為了獲取不同的檔名(.jpg .png 等等，有包含 . 哦)
    );
  },
});

// 參考: https://stackoverflow.com/questions/60408575/how-to-validate-file-extension-with-multer-middleware
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase()); // 檢查 ext，回傳 true or false
  const mimetype = filetypes.test(file.mimetype); // 檢查 MIME type(每個檔案都有 MIME type，長得像這樣 -> image/jpeg)，回傳 true or false

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('只能上傳 .jpg 或 .jpeg 或 .png 檔案哦!');
  }
}

// upload middleware (設置檔案儲存位置、檔名，檢查檔案類型等等)
const upload = multer({
  storage,
  // fileFilter => 只接受特定類型的檔案 (jpg or jpeg or png)
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// single 更改單個檔案 (想同時更改多張照片，參考: https://www.positronx.io/react-multiple-files-upload-with-node-express-tutorial/)
router.post(
  '/',
  protect,
  admin,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    // uploads a local picture to the cloud
    const uploadPhoto = await cloudinary.v2.uploader.upload(`${req.file.path}`); // req.file.path 為暫存在 uploads 資料夾的圖片位置(像這樣 => uploads\image-1637449277314.jpg)
    // console.log(uploadPhoto); // This will give you all the information back from the uploaded photo result
    // console.log(uploadPhoto.url); // This is what we want to send back now in the  res.send
    // secure_url => https
    res.send(uploadPhoto.secure_url);
  })
);

export default router;
