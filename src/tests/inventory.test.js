const redisPubSubService = require("../services/redisPubSub.service");

class InventoryServiceTest {
  constructor() {
    redisPubSubService.subscribe("purchase_events", (channel, message) => {
      InventoryServiceTest.updateInventory(JSON.parse(message));
    });
  }

  static updateInventory(payload) {
    const { productId, quantity } = payload;
    console.log(`Update Inventory ${productId} and ${quantity}`);
  }
}

module.exports = new InventoryServiceTest();
