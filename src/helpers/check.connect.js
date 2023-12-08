"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECONDS = 5000;

// kiểm tra xem đang có bao nhiêu connect tới csdl mongodb
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of connnection::${numConnection}`);
};

// kiểm tra quá tải kết nối tới mongodb
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length; // cpu có 4 core
    const memoryUsage = process.memoryUsage().rss;

    console.log(memoryUsage);

    // giả sử mỗi core chịu được 5 connection
    const maxConnections = numCores * 5;
    console.log(`Active connections: ${numConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log(`Connection overload detected`);
      // notify.send(....)
    }
  }, _SECONDS); // Monitor every 5 seconds
};

module.exports = { countConnect, checkOverload };
