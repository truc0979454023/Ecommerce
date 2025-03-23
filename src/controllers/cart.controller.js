"use strict";

const { CREATED } = require("../core/success.response");
const CartService = require("../services/cart.service");

class CartController {
  addToCart = async (req, res, next) => {
    new CREATED({
      message: "Add Product to Cart Success",
      metaData: await CartService.addToCart({
        ...req.body,
      }),
    }).send(res);
  };

  updateCart = async (req, res, next) => {
    new CREATED({
      message: "Update Product to Cart Success",
      metaData: await CartService.updateToCart({
        ...req.body,
      }),
    }).send(res);
  };

  deleteItemToCartUser = async (req, res, next) => {
    new CREATED({
      message: "Delete Product to Cart Success",
      metaData: await CartService.deleteItemToCartUser({
        ...req.body,
      }),
    }).send(res);
  };

  getListProductToCartUser = async (req, res, next) => {
    new CREATED({
      message: "Get List Product to Cart Success",
      metaData: await CartService.getListUserCart({
        ...req.body,
      }),
    }).send(res);
  };
}

module.exports = new CartController();
