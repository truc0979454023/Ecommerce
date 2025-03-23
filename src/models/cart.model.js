"use strict";

const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Cart";
const COLLECTION_NAME = "Carts";
// Declare the Schema of the Mongo model
const CartSchema = new Schema(
  {
    cartState: {
      type: String,
      required: true,
      enum: ["active", "completed", "failed", "pending"],
      default: "active",
    },
    cartProducts: {
      type: Array,
      required: true,
      default: [],
    },
    cartCountProduct: {
      type: Number,
      required: 0,
    },
    cartUserId: {
      type: "Number",
      required: true,
    },
  },
  {
    collection: COLLECTION_NAME,
    timestamps: {
      createdAt: "createdOn",
      updatedAt: "updatedOn",
    },
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, CartSchema);
