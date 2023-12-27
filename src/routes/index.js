"use strict";

const express = require("express");
const router = express.Router();
const { apiKey, permission } = require("../auth/checkAuth");

// check apiKey
router.use(apiKey);

// check permission
router.use(permission("0000"));

router.use("/v1/api/shop", require('./access'));
router.use("/v1/api/product", require('./product'));
router.use("/v1/api/discount", require('./discount'));
router.use("/v1/api/cart", require('./cart'))

module.exports = router;
