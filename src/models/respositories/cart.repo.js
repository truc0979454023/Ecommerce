"use strict";

const CartService = require("../../services/cart.service");
const cartModel = require("../cart.model");

const findOneUserInCart = async ({ userId }) => {
  return await cartModel.findOne({ cartUserId: userId });
};

const createUserInCart = async ({ userId, product }) => {
  const query = {
    cartUserId: userId,
    cartState: "active",
  };
  const updateOrInsert = {
    $addToSet: {
      cartProducts: product,
    },
  };
  const option = {
    upsert: true,
    new: true,
  };
  return await cartModel.findOneAndUpdate(query, updateOrInsert, option);
};

const updateUserCartQuantity = async ({ userId, product }) => {
  const { productId, quantity } = product;
  const query = {
    cartUserId: userId,
    "cartProducts.productId": productId,
    cartState: "active",
  };
  const updateSet = {
    $inc: {
      "cartProducts.$.quantity": quantity, //dấu ddoolla đại điện cho chính phần tử đó
    },
  };
  const option = {
    upsert: true,
    new: true,
  };
  return await cartModel.findOneAndUpdate(query, updateSet, option);
};

const deleteItemToCartUser = async ({ userId, productId }) => {
  const query = {
    cartUserId: userId,
    cartState: "active",
  };
  const updateSet = {
    $pull: {
      cartProducts: {
        productId,
      },
    },
  };
  return await cartModel.updateOne(query, updateSet);
};

const getListUserCart = async ({ userId }) => {
  return await cartModel
    .findOne({
      cartUserId: userId,
    })
    .lean();
};

module.exports = {
  findOneUserInCart,
  createUserInCart,
  updateUserCartQuantity,
  deleteItemToCartUser,
  getListUserCart,
};
