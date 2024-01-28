"use strict";

const multer = require("multer");


const uploadMemory = multer({
  storage: multer.memoryStorage(),
});

const uploadDisk = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./src/uploads/");
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}` );
    },
  }),
});

/**
 * - lưu ý khi chọn giữa memory store và diskstore hãy xem xét các kích thước file mà xử lý
 * - tốt nhất là không lưu trên memory
 * - diskStorage là lựa chọn tốt hơn - disk rẻ  
*/

module.exports = {
    uploadMemory,
    uploadDisk
}