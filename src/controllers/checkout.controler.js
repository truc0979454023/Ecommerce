"use strict";

const { CREATED } = require("../core/success.response");
const CheckoutService = require("../services/checkout.service");

class CheckoutController {
  checkoutReview = async (req, res, next) => {
    new CREATED({
      message: "Add Product to Cart Success",
      metaData: await CheckoutService.checkoutReview({
        ...req.body,
      }),
    }).send(res);
  };
}

module.exports = new CheckoutController();
