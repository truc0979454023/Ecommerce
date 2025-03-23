"use strict";

const { BadRequestError } = require("../core/error.response");
const {
  clothing,
  electronic,
  product,
  furniture,
} = require("../models/product.model");
const { insertInventory } = require("../models/respositories/inventory.repo");
const {
  findAllDraftsForShop,
  publicProductByShop,
  findAllPublicsForShop,
  unpublicProductByShop,
  getListSearchProductsForUser,
  findAllProductsForUser,
  findOneProductForUser,
  updateProductById,
} = require("../models/respositories/product.repo");
const {
  removeUndefindedAndNullObject,
  updateNestedObjectParser,
} = require("../utils");
const notificationConstain = require("../utils/notificationConstain");
const { pushNotificationToSystem } = require("./notification.service");

//define factory class to create product
class ProductFactory {
  //C2
  static productRegistry = {}; //key-class
  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }
  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type ${type}`);
    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, productId, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestError(`Invalid Product Type ${type}`);
    return new productClass(payload).updateProduct(productId);
  }

  //query  product draft for shop allow  pagination
  static async findAllDraftsForShop({ productShop, limit = 50, page = 1 }) {
    const query = { productShop, isDraft: true };
    return await findAllDraftsForShop({ query, limit, page });
  }

  //query  product public  for shop allow  pagination
  static async findAllPublicsForShop({ productShop, limit = 50, page = 1 }) {
    const query = { productShop, isPublic: true };
    return await findAllPublicsForShop({ query, limit, page });
  }

  //put product from draft to public by productShop and productId
  static async publicProductByShop({ productShop, productId }) {
    return await publicProductByShop({ productShop, productId });
  }

  //put product from public to unpublic by productShop and productId
  static async unpublicProductByShop({ productShop, productId }) {
    return await unpublicProductByShop({ productShop, productId });
  }

  //get List product for user dont need login
  static async getListSearchProductsForUser({ keySearch }) {
    return await getListSearchProductsForUser({ keySearch });
  }

  static async findAllProductsForUser({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublic: true },
    select = ["productName", "productPrice", "productThumb", "productShop"],
  }) {
    return await findAllProductsForUser({ limit, sort, page, filter, select });
  }

  static async findOneProductForUser({ productId, unSelect = ["__v"] }) {
    return await findOneProductForUser({ productId, unSelect });
  }
}

class Product {
  constructor({
    productName,
    productThumb,
    productDescription,
    productPrice,
    productQuantity,
    productType,
    productShop,
    productAttributes,
  }) {
    this.productName = productName;
    this.productThumb = productThumb;
    this.productDescription = productDescription;
    this.productPrice = productPrice;
    this.productQuantity = productQuantity;
    this.productType = productType;
    this.productShop = productShop;
    this.productAttributes = productAttributes;
  }

  //create new product
  async createProduct({ productId }) {
    const newProduct = await product.create({ ...this, _id: productId });
    if (newProduct) {
      //auto add new product in inventory table
      await insertInventory({
        productId: newProduct._id,
        shopId: this.productShop,
        stock: this.productQuantity,
      });

      //Đẩy thông báo cho người dùng khi tạo sản phẩm
      pushNotificationToSystem({
        type: notificationConstain.SHOP_001,
        receivedId: 1,
        senderId: this.productShop,
        options: {
          productName: this.productName,
          shopName: this.productShop,
        },
      })
        .then((res) => console.log(res))
        .catch(console.error);
    }
    return newProduct;
  }

  async updateProduct({ productId, bodyUpdate }) {
    return await updateProductById({
      productId,
      bodyUpdate,
      model: product,
    });
  }
}

//define sub-class for diffirent product type clothing

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newClothing) throw new BadRequestError("Create new clothing error");
    const newProduct = await super.createProduct({
      productId: newClothing._id,
    });
    if (!newProduct) throw new BadRequestError("Create new Product error");
    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefindedAndNullObject(this);
    if (objectParams.productAttributes) {
      //update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.productAttributes),
        model: clothing,
      });
    }
    const updateProduct = await super.updateProduct({
      productId,
      bodyUpdate: updateNestedObjectParser(objectParams),
    });
    return updateProduct;
  }
}

//define sub-class for diffirent product type electronics
class Electronic extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newElectronic)
      throw new BadRequestError("Create new electronic error");
    const newProduct = await super.createProduct({
      productId: newElectronic._id,
    });
    if (!newProduct) throw new BadRequestError("Create new Product error");
    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefindedAndNullObject(this);
    if (objectParams.productAttributes) {
      //update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.productAttributes),
        model: electronic,
      });
    }
    const updateProduct = await super.updateProduct({
      productId,
      bodyUpdate: updateNestedObjectParser(objectParams),
    });
    return updateProduct;
  }
}

//define sub-class for diffirent product type Furniture
class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.productAttributes,
      productShop: this.productShop,
    });
    if (!newFurniture) throw new BadRequestError("Create new Furniture error");
    const newProduct = await super.createProduct({
      productId: newFurniture._id,
    });
    if (!newProduct) throw new BadRequestError("Create new Product error");
    return newProduct;
  }

  async updateProduct(productId) {
    const objectParams = removeUndefindedAndNullObject(this);
    if (objectParams.productAttributes) {
      //update child
      await updateProductById({
        productId,
        bodyUpdate: updateNestedObjectParser(objectParams.productAttributes),
        model: furniture,
      });
    }
    const updateProduct = await super.updateProduct({
      productId,
      bodyUpdate: updateNestedObjectParser(objectParams),
    });
    return updateProduct;
  }
}

// register productType
ProductFactory.registerProductType("Electronic", Electronic);
ProductFactory.registerProductType("Clothing", Clothing);
ProductFactory.registerProductType("Furniture", Furniture);

module.exports = ProductFactory;
