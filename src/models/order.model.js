const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Order";
const COLLECTION_NAME = "Orders";
// Declare the Schema of the Mongo model
var OrderSchema = new Schema(
  {
    orderUserId: {
      type: Number,
      required: true,
    },
    orderCheckout: {
      type: Object,
      default: {},
    },
    /*
    orderCheckout : {
        totalPrice,
        totalApllyDiscount,
        feeShip
    }
    */
    orderShipping: { type: Object, default: {} },
    orderPayment: { type: Object, default: {} },
    orderProducts: { type: Array, default: [] },
    orderTrackingNumber: { type: String, default: "" },
    orderStatus: {
      type: String,
      enum: ["pending", "comfirm", "shipped", "cancelled", "delivered"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, OrderSchema);
