"use strict";

const { model, Schema } = require("mongoose");

const DOCUMENT_NAME = "Notification";
const COLLECTION_NAME = "Notifications";

//ORDER-001: ORDER SUCCESSFULLY
//ORDER-002: ORDER FAILED
//PROMOTION-001: NEW PROMOTION
//SHOP-001: NEW PRODUCT BY USER FOLLOWING
const notificationSchema = new Schema(
  {
    notificationType: {
      type: String,
      emun: ["ORDER-001", "ORDER-002", "PROMOTION-001", "SHOP-001"],
      default: true,
    },
    notificationSenderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Shop",
    },
    notificationRecievedId: {
      type: Number,
      required: true,
    },
    notificationContent: { type: String, required: true },
    notificationOptions: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

module.exports = model(DOCUMENT_NAME, notificationSchema);
