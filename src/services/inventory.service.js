"use strict";

const { BadRequestError } = require("../core/error.response");
const inventoryModel = require("../models/inventory.model");
const { getProductById } = require("../models/respositories/product.repo");

class InventoryService {
  static addStockToInventory = async ({
    stock,
    productId,
    shopId,
    location,
  }) => {
    const product = await getProductById(productId);
    if (!product) throw new BadRequestError("Product does not exist");
    const query = { inventoryShopId: shopId, inventoryProductId: productId };
    const updateSet = {
      $inc: {
        inventoryStock: stock,
      },
      $set: {
        inventoryLocation: location,
      },
    };
    const options = { upsert: true, new: true };

    return await inventoryModel.findOneAndUpdate(query, updateSet, options);
  };
}

module.exports = InventoryService;
