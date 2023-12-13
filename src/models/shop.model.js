"use strict";
// key !dmbg install by Mongo Snippets for Node-js

const { model, Schema, Types } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "Shops";

// Declare the Schema of the Mongo model
const shopSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    status: { // shop này cho phép hoạt động hay không ?
      type: String,
      enum: ["active", "inactive"],
      default: "inactive",
    },
    verify: { // xác minh shop thực sự đã đăng ký thành công chưa 
      type: Schema.Types.Boolean,
      default: false,
    },
    roles: { // shop này có quyền đăng sp, xóa sp, sửa sp, truy cập tài nguyên hệ thống ...
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);
