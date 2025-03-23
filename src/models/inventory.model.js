const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Inventory";
const COLLECTION_NAME = "Inventories";
// Declare the Schema of the Mongo model
var InventorySchema = new Schema(
  {
    inventoryProductId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
    inventoryLocation: {
      type: String,
      default: "unKnow",
    },
    inventoryStock: {
      type: Number,
      require: true,
    },
    inventoryShopId: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
    },
    inventoryReservation: {
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
module.exports = model(DOCUMENT_NAME, InventorySchema);
