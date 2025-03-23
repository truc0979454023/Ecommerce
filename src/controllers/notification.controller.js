"use strict";

const { CREATED } = require("../core/success.response");
const notificationSerivce = require("../services/notification.service");

class NotificationController {
  listNotificationByUser = async (req, res, next) => {
    new CREATED({
      message: "Get list Notification by USer Success",
      metaData: await notificationSerivce.listNotificationByUser({
        ...req.query,
      }),
    }).send(res);
  };
}

module.exports = new NotificationController();
