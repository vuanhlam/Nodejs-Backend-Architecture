"use strict";

const express = require("express");
const router = express.Router();
const accessRoute = require("./access");

router.use("/v1/api", accessRoute);

// router.get("", (req, res, next) => {
//   return res.status(200).json({
//     message: "Welcome to Nodejs",
//   });
// });

module.exports = router;
