"use strict";

const { convertToObjectIdMongodb } = require("../../utils");
const inventoryModel = require("../inventory.model");

const insertInventory = async ({
  productId,
  shopId,
  stock,
  location = "unKnow",
}) => {
  return await inventoryModel.create({
    inventoryProductId: productId,
    inventoryShopId: shopId,
    inventoryLocation: location,
    inventoryStock: stock,
  });
};

const reservationInventory = async ({ productId, quantity, cartId }) => {
  const query = {
    inventoryProductId: convertToObjectIdMongodb(productId),
    inventoryStock: { $gte: quantity },
  };
  const updateSet = {
    $inc: {
      inventoryStock: -quantity,
    },
    $push: {
      inventoryReservations: {
        quantity,
        cartId,
        createOn: new Date(),
      },
    },
  };
  const options = { upsert: true, new: true };
  return await inventoryModel.updateOne(query, updateSet, options);
};

module.exports = {
  insertInventory,
  reservationInventory,
};
