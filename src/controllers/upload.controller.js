"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const { uploadImageFromUrl, uploadImageFromLocal } = require("../services/upload.service");

class UploadController {
  uploadFile = async (req, res, next) => {
    new SuccessResponse({
      message: "Upload success!",
      metadata: await uploadImageFromUrl(),
    }).send(res);
  };

  uploadFileThumb = async (req, res, next) => {
    const { file } = req
    console.log(req.file)
    if(!file) {
      throw new BadRequestError('File missing')
    }

    new SuccessResponse({
      message: "Upload success!",
      metadata: await uploadImageFromLocal({ path: file.path }),
    }).send(res);
  };
}

module.exports = new UploadController();
