"use strict";

const { CREATED, SuccessResponse } = require("../core/success.response");
const ProductService = require("../services/product.service");

class ProductController {
  //SHOP

  createProduct = async (req, res, next) => {
    new CREATED({
      message: "Create Product Success",
      metaData: await ProductService.createProduct(req.body.productType, {
        ...req.body,
        productShop: req.user.userId,
      }),
    }).send(res);
  };

  updateProduct = async (req, res, next) => {
    new CREATED({
      message: "Update Product Success",
      metaData: await ProductService.updateProduct(
        req.body.productType,
        req.params.productId,
        {
          ...req.body,
          productShop: req.user.userId,
        }
      ),
    }).send(res);
  };

  //put product from draft to public by productShop and productId
  publicProductByShop = async (req, res, next) => {
    new CREATED({
      message: "Public Product Success",
      metaData: await ProductService.publicProductByShop({
        productShop: req.user.userId,
        productId: req.params.id,
      }),
    }).send(res);
  };

  //put product from public to unpublic by productShop and productId
  unpublicProductByShop = async (req, res, next) => {
    new CREATED({
      message: "Unpublic Product Success",
      metaData: await ProductService.unpublicProductByShop({
        productShop: req.user.userId,
        productId: req.params.id,
      }),
    }).send(res);
  };

  //query
  /**
   * @description Get all Drafts for shop
   * @param {Number} limit
   * @returns {JSON}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Drafts success",
      metaData: await ProductService.findAllDraftsForShop({
        productShop: req.user.userId,
      }),
    }).send(res);
  };

  getAllPublicsForShop = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Publics success",
      metaData: await ProductService.findAllPublicsForShop({
        productShop: req.user.userId,
      }),
    }).send(res);
  };

  //USER

  //get List product for user dont need login
  getListSearchProductsForUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list search Product for users success",
      metaData: await ProductService.getListSearchProductsForUser(req.params), //req.params => http::localhost:3000/api/params
    }).send(res);
  };

  findAllProductsForUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Get all Products for users success",
      metaData: await ProductService.findAllProductsForUser(req.query), //req.query => http::localhost:3000/api?query1=3&query2="ab"
    }).send(res);
  };

  findOneProductForUser = async (req, res, next) => {
    new SuccessResponse({
      message: "Get Product for users success",
      metaData: await ProductService.findOneProductForUser({
        productId: req.params.productId,
      }),
    }).send(res);
  };

  //end query
}

module.exports = new ProductController();
