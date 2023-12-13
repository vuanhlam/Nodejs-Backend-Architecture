"use strict";

const express = require("express");
const router = express.Router();
const accessRoute = require("./access");
const { apiKey, permission } = require("../auth/checkAuth");

// check apiKey
router.use(apiKey);

// check permission
router.use(permission("0000"));

router.use("/v1/api", accessRoute);

module.exports = router;
