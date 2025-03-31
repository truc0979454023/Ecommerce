"use strict";

const { CREATED } = require("../core/success.response");
const RbacSerivce = require("../services/rbac.service");

class RbacController {
  createRole = async (req, res, next) => {
    new CREATED({
      message: "Created Role",
      metaData: await RbacSerivce.createRole(req.body),
    }).send(res);
  };

  createResource = async (req, res, next) => {
    new CREATED({
      message: "Created Resource",
      metaData: await RbacSerivce.createResource(req.body),
    }).send(res);
  };

  getListResource = async (req, res, next) => {
    new CREATED({
      message: "Get List Resource",
      metaData: await RbacSerivce.getListResource(req.query),
    }).send(res);
  };

  getListRole = async (req, res, next) => {
    new CREATED({
      message: "Get lIst Role",
      metaData: await RbacSerivce.getListRole(req.query),
    }).send(res);
  };
}

module.exports = new RbacController();
