"use strict";

const express = require("express");
const uploadController = require("../../controllers/upload.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();

// router.use(authenticationV2);   

router.post("/product", asyncHandler(uploadController.uploadFile));

module.exports = router;
