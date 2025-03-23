"use strict";

const notificationModel = require("../models/notification.model");
const notificationConstain = require("../utils/notificationConstain");

class notificationSerivce {
  static async pushNotificationToSystem(payload) {
    const {
      type = notificationConstain.SHOP_001,
      receivedId = 1,
      senderId = 1,
      options = {},
    } = payload;

    let notificationContent;

    if (type === notificationConstain.SHOP_001) {
      notificationContent = `@@@ vừa thêm một săn phẩm: @@@@`;
    } else if (type === notificationConstain.PROMOTION_001) {
      notificationContent = `@@@ vừa thêm một voucher: @@@@@`;
    }

    const newNotification = await notificationModel.create({
      notificationType: type,
      notificationContent: notificationContent,
      notificationSenderId: senderId,
      notificationReceivedId: receivedId,
      notificationOptions: options,
    });

    return newNotification;
  }

  static async listNotificationByUser(payload) {
    const { userId = 1, type = notificationConstain.ALL, isRead = 0 } = payload;

    const match = { notificationReceivedId: userId };
    if (type !== notificationConstain.ALL) {
      match["notificationType"] = type;
    }

    return await notificationModel.aggregate([
      {
        $match: match,
      },
      {
        $project: {
          notificationType: 1,
          notificationSenderId: 1,
          notificationReceivedId: 1,
          notificationContent: 1,
          //   notificationContent: {
          //     $concat: [
          //       { $substr: ["$notificationOptions.shopName", 0, -1] },
          //       " vừa mới thêm một sản phẩm mới: ", //language,
          //       {
          //         $substr: ["$notificationOptions.productName", 0, -1],
          //       },
          //     ],
          //   },
          notificationOptions: 1,
          createAt: 1,
        },
      },
    ]);
  }
}

module.exports = notificationSerivce;
