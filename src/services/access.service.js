"use strict";

const shopModel = require("../models/shop.model");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const KeyTokenService = require("./keyToken.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  ForbiddenError,
  AuthFailureError,
  BadRequestError,
} = require("../core/error.response");
const { findByEmail } = require("./shop.service");

const roleShop = {
  SHOP: "SHOP",
  WRITE: "WRITE",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    //step 1 check email exists
    const holderShop = await shopModel.findOne({ email })?.lean(); //lean() giup toi uu viec query
    if (holderShop) {
      throw new BadRequestError("Error Shop already registered");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: passwordHash,
      roles: [roleShop.SHOP],
    });

    if (newShop) {
      //create privatekey k luu vao db,publickey luu vao db va su dung public key db de xu ly sau do
      // const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
      //   modulusLength: 4096,
      //   publicKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      //   privateKeyEncoding: {
      //     type: "pkcs1",
      //     format: "pem",
      //   },
      // });

      const privateKey = crypto.randomBytes(64).toString("hex");
      const publicKey = crypto.randomBytes(64).toString("hex");

      //luu lai publickey vao db duoi dang string va tra ve public da luu tren db
      const keysStore = await KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
      });

      if (!keysStore) throw new BadRequestError("Public key string error!!!");

      //create token pair
      const token = await createTokenPair(
        { userId: newShop._id, email },
        keysStore.publicKey,
        keysStore.privateKey
      );

      return {
        shop: getInfoData({
          fields: ["_id", "name", "email"],
          object: newShop,
        }),
        token,
      };
    }
    return {
      code: 200,
      metaData: null,
    };
  };

  static login = async ({ email, password }) => {
    const foundShop = await findByEmail({ email: email });
    if (!foundShop) {
      throw new BadRequestError("Shop Not Registered");
    }

    const match = bcrypt.compare(password, foundShop.password);

    if (!match) {
      throw new AuthFailureError("Authentication Error");
    }

    const privateKey = crypto.randomBytes(64).toString("hex");
    const publicKey = crypto.randomBytes(64).toString("hex");

    const { _id: userId } = foundShop;

    const token = await createTokenPair(
      { userId: userId, email },
      publicKey,
      privateKey
    );

    await KeyTokenService.createKeyToken({
      refreshToken: token.refreshToken,
      privateKey: privateKey,
      publicKey: publicKey,
      userId: userId,
    });

    return {
      shop: getInfoData({
        fields: ["_id", "name", "email"],
        object: foundShop,
      }),
      token,
    };
  };

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore._id);
    return delKey;
  };

  static handleRefreshToken = async ({ keyStore, user, refreshToken }) => {
    const { userId, email } = user;
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenError("Something wrong happend!! Pls relogin");
    }
    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Shop not registered");

    const foundShop = await findByEmail({ email });
    if (!foundShop) throw new AuthFailureError("Shop not registed");

    const token = await createTokenPair(
      { userId, email },
      keyStore?.publicKey,
      keyStore?.privateKey
    );

    await keyStore.updateOne({
      $set: {
        refreshToken: token.refreshToken, //add token moi tao vao,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken, //add token cu vo list da su dung,
      },
    });

    return {
      user,
      token,
    };
    // const foundToken = await KeyTokenService.findByRefreshTokenUsed(
    //   refreshToken
    // );
    // if (foundToken) {
    //   const { userId } = verifyJWT(refreshToken, foundToken.privateKey);
    //   await KeyTokenService.deleteKeyById(userId);
    //   throw new ForbiddenError("Something wrong happend!! Pls relogin");
    // }

    // const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    // if (!holderToken) {
    //   throw new AuthFailureError("Shop not registed");
    // }
    // // const { userId, email } = verifyJWT(refreshToken, holderToken.privateKey);

    // const foundShop = await findByEmail({ email });
    // if (!foundShop) throw new AuthFailureError("Shop not registed");

    // const token = await createTokenPair(
    //   { userId, email },
    //   holderToken?.publicKey,
    //   holderToken?.privateKey
    // );

    // await holderToken.updateOne({
    //   $set: {
    //     refreshToken: token.refreshToken, //add token moi tao vao,
    //   },
    //   $addToSet: {
    //     refreshTokenUsed: refreshToken, //add token cu vo list da su dung,
    //   },
    // });

    // return {
    //   user: { userId, email },
    //   token,
    // };
  };
}

module.exports = AccessService;
