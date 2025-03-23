"use strict";

const { product } = require("../product.model");
const {
  getSelectData,
  getUnselectData,
  convertToObjectIdMongodb,
} = require("../../utils");

//SHOP

const findAllDraftsForShop = async ({ query, limit, page }) => {
  return queryProducts({ query, limit, page });
};

const findAllPublicsForShop = async ({ query, limit, page }) => {
  return queryProducts({ query, limit, page });
};

const publicProductByShop = async ({ productShop, productId }) => {
  const foundShop = await product.findOne({
    productShop: convertToObjectIdMongodb(productShop),
    _id: convertToObjectIdMongodb(productId),
  });
  if (!foundShop) return null;
  foundShop.isDraft = false;
  foundShop.isPublic = true;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

const unpublicProductByShop = async ({ productShop, productId }) => {
  const foundShop = await product.findOne({
    productShop: convertToObjectIdMongodb(productShop),
    _id: convertToObjectIdMongodb(productId),
  });
  if (!foundShop) return null;
  foundShop.isDraft = true;
  foundShop.isPublic = false;
  const { modifiedCount } = await foundShop.updateOne(foundShop);
  return modifiedCount;
};

//USER

const getListSearchProductsForUser = async ({ keySearch }) => {
  const regexSearch = new RegExp(keySearch);
  const results = await product
    .find(
      {
        isPublic: true,
        $text: { $search: regexSearch },
      },
      { score: { $meta: "textScore" } }
    )
    .sort({ score: { $meta: "textScore" } })
    .lean();

  return results;
};

const findAllProductsForUser = async ({
  limit,
  sort,
  page,
  filter,
  select,
}) => {
  const skip = (page - 1) * limit;
  const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
  const products = await product
    .find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    .select(getSelectData(select))
    .lean();

  return products;
};

const findOneProductForUser = async ({ productId, unSelect }) => {
  return await product.findById(productId).select(getUnselectData(unSelect));
};

// query dùng chung
const queryProducts = async ({ query, limit, page }) => {
  const skip = (page - 1) * limit;
  return await product
    .find(query)
    .populate("productShop", "name email -_id")
    .sort({ updateAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean()
    .exec();
};

const updateProductById = async ({
  productId,
  bodyUpdate,
  model,
  isNew = true,
}) => {
  return await model.findByIdAndUpdate(productId, bodyUpdate, {
    new: isNew,
  });
};

const getProductById = async ({ productId }) => {
  return await product
    .findOne({ _id: convertToObjectIdMongodb(productId) })
    .lean();
};

const checkProductByServer = async ({ products }) => {
  return await Promise.all(
    products.map(async (product) => {
      const foundProduct = await getProductById(product.productId);
      if (foundProduct) {
        return {
          price: foundProduct.productPrice,
          quantity: product.quantity,
          productId: product.productId,
        };
      }
    })
  );
};

module.exports = {
  findAllDraftsForShop,
  findAllPublicsForShop,
  publicProductByShop,
  unpublicProductByShop,
  getListSearchProductsForUser,
  findAllProductsForUser,
  findOneProductForUser,
  updateProductById,
  getProductById,
  checkProductByServer,
};
