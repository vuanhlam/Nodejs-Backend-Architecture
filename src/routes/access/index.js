"use strict";

const express = require("express");
const accessController = require("../../controllers/access.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authentication, authenticationV2, verifyRefreshToken } = require("../../auth/authUtils");
const router = express.Router();

// signUp
router.post("/signup", asyncHandler(accessController.signUp));
router.post("/login", asyncHandler(accessController.login));
router.post("/handlerRefreshToken", verifyRefreshToken ,asyncHandler(accessController.handleRefreshToken));

// authentication
router.use(authenticationV2);

router.post("/logout", asyncHandler(accessController.logout)); //xác định đúng đối tượng không rồi mới cho logout

module.exports = router;
