"use strict";

const keyTokenModel = require("../models/keyToken.model");
const { convertToObjectIdMongodb } = require("../utils");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
    try {
      // const keys = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey,
      // });
      // return keys
      //   ? { publicKey: keys.publicKey, privateKey: keys.privateKey }
      //   : null;

      const filter = { user: userId };
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken,
      };
      const options = { upsert: true, new: true };

      const keys = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options
      );

      return keys
        ? { publicKey: keys.publicKey, privateKey: keys.privateKey }
        : null;
    } catch (error) {
      return error;
    }
  };

  static findByUserId = async (userId) => {
    const keyStore = await keyTokenModel.findOne({
      user: convertToObjectIdMongodb(userId),
    });

    return keyStore;
  };

  static removeKeyById = async (id) => {
    return await keyTokenModel.deleteOne({ _id: id });
  };
  static findByRefreshTokenUsed = async (refreshToken) => {
    return await keyTokenModel
      .findOne({ refreshTokenUsed: refreshToken })
      .lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return await keyTokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId) => {
    return await keyTokenModel.deleteOne({
      user: convertToObjectIdMongodb(userId),
    });
  };
}

module.exports = KeyTokenService;
