"use strict";

const {
  listNotiByUser
} = require("../services/notification.service");
const { SuccessResponse } = require("../core/success.response");

class NotificationController {
  getListNotiByUser = async (req, res, next) => {
    new SuccessResponse({
      message: "get list noti by user success",
      metadata: await listNotiByUser(req.query),
    }).send(res);
  };
}

module.exports = new NotificationController();
