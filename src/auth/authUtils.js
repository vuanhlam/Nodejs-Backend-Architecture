"use strict";

const JWT = require("jsonwebtoken");
const asyncHandler = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const { findByUserId } = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
};

const createTokenPair = (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });

    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    return { accessToken, refreshToken };
  } catch (error) {
    return error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  /**
    1 - Check userId missing ?
    2 - check user in dbs
    3 - get accessToken
    4 - verifyToken
      - check keyStore with this userId ?
    5 - Ok all -> return next
  */

  //1.
  const userId = req.headers[HEADER.CLIENT_ID];
  if (!userId) throw new AuthFailureError("Invalid Request");

  //2.
  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not Found Key store");

  //3.
  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) throw new NotFoundError("Invalid Request");

  //4.
  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId) throw new AuthFailureError("Invalid UserId");
    req.keyStore = keyStore;
    next()
  } catch (error) {
    throw error;
  }
});

const verifyJWT = (token, secretKey) => {
  return JWT.verify(token, secretKey);
}

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT
};
