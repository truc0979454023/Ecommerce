"use strict";

const { CREATED } = require("../core/success.response");
const DiscountService = require("../services/discount.service");

class DiscountController {
  createDiscount = async (req, res, next) => {
    new CREATED({
      message: "Create Discount Success",
      metaData: await DiscountService.createDiscountCode({
        ...req.body,
        discountShopId: req.user.userId,
      }),
    }).send(res);
  };

  updateDiscount = async (req, res, next) => {
    new CREATED({
      message: "Create Discount Success",
      metaData: await DiscountService.updateDiscountCode(
        req.params.discountId,
        { ...req.body, discountShopId: req.user.userId }
      ),
    }).send(res);
  };

  getAllDiscountCodeWithProductForUser = async (req, res, next) => {
    new CREATED({
      message: "Create Discount for User Success",
      metaData: await DiscountService.getAllDiscountCodeWithProductForUser({
        ...req.query,
        discountShopId: req.user.userId,
      }),
    }).send(res);
  };

  getAllDiscountCodeWithProductForShop = async (req, res, next) => {
    new CREATED({
      message: "Get Discount for shop Success",
      metaData: await DiscountService.getAllDiscountCodeWithProductForShop({
        ...req.query,
        discountShopId: req.user.userId,
      }),
    }).send(res);
  };

  getDiscountAmount = async (req, res, next) => {
    new CREATED({
      message: "Get Discount amount Success",
      metaData: await DiscountService.getDiscountAmount({
        ...req.body,
        discountShopId: req.user.userId,
      }),
    }).send(res);
  };

  deleteDiscountCode = async (req, res, next) => {
    new CREATED({
      message: "Delete Discount Code Success",
      metaData: await DiscountService.deleteDiscountCode({
        ...req.body,
        discountShopId: req.user.userId,
      }),
    }).send(res);
  };

  cancelDiscountCode = async (req, res, next) => {
    new CREATED({
      message: "Cancel Discount Code Success",
      metaData: await DiscountService.cancelDiscountCode({
        ...req.body,
        discountShopId: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new DiscountController();
