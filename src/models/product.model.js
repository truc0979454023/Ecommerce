"use strict";

const { model, Schema } = require("mongoose"); // Erase if already required
const { default: slugify } = require("slugify");

const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";
// Declare the Schema of the Mongo model
var productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    productThumb: {
      type: String,
      required: true,
    },
    productSlug: String,
    productDescription: {
      type: String,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productQuantity: {
      type: Number,
      required: true,
    },
    productType: {
      type: String,
      required: true,
      enum: ["Electronic", "Clothing", "Furniture"],
    },
    productShop: { type: Schema.Types.ObjectId, ref: "Shop" },
    productAttributes: {
      type: Schema.Types.Mixed,
      require: true,
    },
    productRatingAverage: {
      type: Number,
      default: 4.5,
      min: [1, "Rating must be above 1.0"],
      min: [5, "Rating must be above 5.0"],
      set: (val) => Math.round(val * 10),
    },
    productVariation: {
      type: Array,
      default: [],
    },
    isDraft: {
      type: Boolean,
      default: true,
      index: true, //danh thu tu
      select: false, //k lay truong nay khi find,findOne,...
    },
    isPublic: {
      type: Boolean,
      default: false,
      index: true, //danh thu tu
      select: false, //k lay truong nay khi find,findOne,...
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);
//create index for search
productSchema.index({ productName: "text", productDescription: "text" });

//document middleware : runs before .save() and .create()...
productSchema.pre("save", function (next) {
  this.productSlug = slugify(this.productName, { lower: true });
  next();
});

//define the product type clothing

const clothingSchema = new Schema(
  {
    brand: {
      type: String,
      require: true,
    },
    productShop: { type: Schema.Types.ObjectId, ref: "Shop" },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
  },
  {
    collection: "Clothings",
    timestamps: true,
  }
);

//define the product type electronic
const electronicSchema = new Schema(
  {
    manufacturer: {
      type: String,
      require: true,
    },
    model: {
      type: String,
    },
    productShop: { type: Schema.Types.ObjectId, ref: "Shop" },
    color: {
      type: String,
    },
  },
  {
    collection: "Electronics",
    timestamps: true,
  }
);

//define the product type Furnitures
const furnitureSchema = new Schema(
  {
    brand: {
      type: String,
      require: true,
    },
    productShop: { type: Schema.Types.ObjectId, ref: "Shops" },
    size: {
      type: String,
    },
    material: {
      type: String,
    },
  },
  {
    collection: "Furnitures",
    timestamps: true,
  }
);

//Export the model
module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model("clothing", clothingSchema),
  electronic: model("electronic", electronicSchema),
  furniture: model("furniture", furnitureSchema),
};
