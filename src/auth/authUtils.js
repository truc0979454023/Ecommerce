"use strict";
const JWT = require("jsonwebtoken");
const { asyncHandler } = require("../helpers/asyncHandler");
const { AuthFailureError, NotFoundError } = require("../core/error.response");
const KeyTokenService = require("../services/keyToken.service");

const HEADER = {
  API_KEY: "x-api-key",
  CLIENT_ID: "x-client-id",
  AUTHORIZATION: "authorization",
  REFRESHTOKEN: "x-token-id",
};

const verifyJWT = (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = JWT.sign(payload, publicKey, {
      expiresIn: "2 days",
    });
    const refreshToken = JWT.sign(payload, privateKey, {
      expiresIn: "7 days",
    });

    // JWT.verify(accessToken, publicKey, (err, decode) => {
    //   if (err) {
    //     console.error("Error verify:", err);
    //   } else {
    //     console.log(`Decode verify:`, decode);
    //   }
    // });
    return { accessToken, refreshToken };
  } catch (error) {
    throw error;
  }
};

const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID];

  if (!userId) throw new AuthFailureError("Invalid Request");

  const keyStore = await KeyTokenService.findByUserId(userId);
  if (!keyStore) throw new NotFoundError("Not Found Key Store");

  if (req.headers[HEADER.REFRESHTOKEN]) {
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN];
      const decodeUser = verifyJWT(refreshToken, keyStore.privateKey);

      if (userId !== decodeUser.userId) {
        throw new AuthFailureError("Invalid UserId");
      }
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION];
  if (!accessToken) {
    throw new AuthFailureError("Invalid Request");
  }
  try {
    const decodeUser = verifyJWT(accessToken, keyStore.publicKey);

    if (userId !== decodeUser.userId) {
      throw new AuthFailureError("Invalid UserId");
    }
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});

module.exports = {
  createTokenPair,
  authentication,
  verifyJWT,
};
