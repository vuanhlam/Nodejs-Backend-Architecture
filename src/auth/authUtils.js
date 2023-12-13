"use strict";

const JWT = require("jsonwebtoken");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "2 days",
    });

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: "RS256",
      expiresIn: "7 days",
    });

    JWT.verify(accessToken, publicKey, (error, result) => {
      if(error) {
        console.error(`error verify: `, error)
      }else {
        console.log(`decode verify: `, result)
      }
    })

    return { accessToken, refreshToken }
  } catch (error) {
    return error;
  }
};

module.exports = {
  createTokenPair,
};
