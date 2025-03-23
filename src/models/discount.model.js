"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Discount";
const COLLECTION_NAME = "Discounts";
// Declare the Schema of the Mongo model
var DiscountSchema = new Schema(
  {
    discountName: {
      type: String,
      require: true,
    },
    discountDescription: {
      type: String,
      require: true,
    },
    discountType: {
      type: String,
      default: "fixed_amount", //percentage
    },
    discountValue: {
      type: Number,
      require: true,
    },
    discountCode: {
      type: String,
      require: true,
    },
    discountStartDate: {
      type: Date,
      require: true,
    },
    discountEndDate: {
      type: Date,
      require: true,
    },
    //tối đa số discount còn có thể sử dụng
    discountMaxUses: {
      type: Number,
      require: true,
    },
    //danh sách user dùng discount
    discountUsersUsed: {
      type: Array,
      default: [],
    },
    //số user đã dùng discount
    discountUserUsedCount: {
      type: Number,
      require: true,
    },
    //số lượng discount max mỗi user có thể dùng
    discountMaxUsesPerUser: { type: Number, require: true },
    //đơn hàng tối thiểu bao nhiêu thì áp dụng discount
    discountMinOrderValue: {
      type: Number,
      require: true,
    },
    discountShopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    discountIsActive: {
      type: Boolean,
      default: true,
    },
    discountAppliesTo: {
      type: String,
      require: true,
      enum: ["all", "specific"],
    },
    discountProductIds: {
      type: Array,
      default: [],
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, DiscountSchema);
