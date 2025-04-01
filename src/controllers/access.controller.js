"use strict";

const { BadRequestError } = require("../core/error.response");
const { CREATED, SuccessResponse } = require("../core/success.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "Registerd OK",
      metaData: await AccessService.signUp(req.body),
    }).send(res);
    // return res.status(201).json(await AccessService.signUp(req.body));
  };
  login = async (req, res, next) => {
    const sendData = Object.assign(
      {
        requestId: req.requestId,
      },
      req.body
    );
    new SuccessResponse({
      metaData: await AccessService.login(sendData),
    }).send(res);
  };

  handleRefreshToken = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Token success",
      metaData: await AccessService.handleRefreshToken({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  logout = async (req, res, next) => {
    new SuccessResponse({
      message: "Logout success",
      metaData: await AccessService.logout(req.keyStore), //req.keyStore vi truoc router xu ly ham middleware return req.keyStore,
    }).send(res);
  };
}

module.exports = new AccessController();
