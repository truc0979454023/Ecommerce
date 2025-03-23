"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const productController = require("../../controllers/product.controller");
const router = express.Router();

//get list search product by user dont need login
router.get(
  "/search/:keySearch",
  asyncHandler(productController.getListSearchProductsForUser)
);

router.get("", asyncHandler(productController.findAllProductsForUser));
router.get(
  "/:productId",
  asyncHandler(productController.findOneProductForUser)
);

//authentication
router.use(authentication);

router.post("", asyncHandler(productController.createProduct));
router.patch("/:productId", asyncHandler(productController.updateProduct));
router.get("/public/:id", asyncHandler(productController.publicProductByShop));
router.get(
  "/unpublic/:id",
  asyncHandler(productController.unpublicProductByShop)
);
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/publics/all",
  asyncHandler(productController.getAllPublicsForShop)
);

module.exports = router;
