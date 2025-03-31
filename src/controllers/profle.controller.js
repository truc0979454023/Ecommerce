"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");

const dataProfiles = [
  {
    userId: 1,
    userName: "MinhTruc",
    userAvatar: "avatar/user/1",
  },
  {
    userId: 2,
    userName: "MinhTruc2",
    userAvatar: "avatar/user/2",
  },
  {
    userId: 3,
    userName: "MinhTruc3",
    userAvatar: "avatar/user/3",
  },
];
class ProfileController {
  //admin
  profiles = async (req, res, next) => {
    new CREATED({
      message: "View All Profiles",
      metaData: dataProfiles,
    }).send(res);
  };
  //shop
  profile = async (req, res, next) => {
    new CREATED({
      message: "View Profile",
      metaData: {
        userId: 1,
        userName: "MinhTruc",
        userAvatar: "avatar/user/1",
      },
    }).send(res);
  };
}

module.exports = new ProfileController();
