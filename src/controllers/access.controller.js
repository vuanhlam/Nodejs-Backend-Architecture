"use strict";

const { BadRequestError } = require("../core/error.response");
const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
   handleRefreshToken = async (req, res, next) => {
    // new SuccessResponse({
    //   message: "Get token success",
    //   metadata: await AccessService.handlerRefreshToken(req.body.refreshToken),
    // }).send(res);

    // v2 fixed
    new SuccessResponse({
      message: "Get token success",
      metadata: await AccessService.handlerRefreshTokenV2(req),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout success!",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  login = async (req, res, next) => {

    const { email } = req.body;

    if(!email) {
      throw new BadRequestError('email missing')
    }

    new SuccessResponse({
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signUp = async (req, res, next) => {
    // return res.status(201).json(await AccessService.signUp(req.body));
    new CREATED({
      message: "Registered OK!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };
}

module.exports = new AccessController();
