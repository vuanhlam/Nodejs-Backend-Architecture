"use strict";

const express = require("express");
const cartController = require("../../controllers/cart.controller");
const asyncHandler = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
const router = express.Router();


// router.use(authenticationV2);

router.post('', asyncHandler(cartController.addToCart));
router.delete('', asyncHandler(cartController.deleteItemInCart));
router.post('/update', asyncHandler(cartController.update));
router.get('', asyncHandler(cartController.getlistUserCart));

module.exports = router;
