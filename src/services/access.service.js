"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      // step 1 check email exists ??
      const holderShop = await shopModel.findOne({ email }).lean(); // lean giúp trả về object javaScript thuần túy
      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop Already registered",
        };
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: passwordHash,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        // 1. create privateKey, publicKey
        const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1", // public key cryptography standard !
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        });

        // 2. save collection Keystore
        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });

        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "Shop Already registered",
          };
        }

        console.log(`publicKeyString::`, publicKeyString);
        const publicKeyObject = crypto.createPublicKey(publicKeyString);
        console.log(`publicKeyObject::`, publicKeyObject);

        //3. create token pair accessToken & refreshToken
        const tokens = await createTokenPair(
          { userId: newShop._id, email },
          publicKeyObject, // public key lấy từ mongodb, không lấy lúc tự generate
          privateKey
        );

        return {
          code: 201,
          metadata: {
            shop: getInfoData({
              fields: ["_id", "name", "email"],
              object: newShop,
            }),
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (error) {
      return {
        code: "xxx",
        message: error.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
