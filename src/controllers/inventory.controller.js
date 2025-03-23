"use strict";

const { CREATED } = require("../core/success.response");
const InventoryService = require("../services/inventory.service");

class InventoryController {
  addStockToInventory = async (req, res, next) => {
    new CREATED({
      message: "Add Product to Inventory Success",
      metaData: await InventoryService.addStockToInventory({
        ...req.body,
      }),
    }).send(res);
  };
}

module.exports = new InventoryController();
