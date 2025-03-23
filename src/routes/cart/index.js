"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const cartController = require("../../controllers/cart.controller");
const router = express.Router();

router.get("", asyncHandler(cartController.getListProductToCartUser));
router.post("", asyncHandler(cartController.addToCart));
router.post("/update", asyncHandler(cartController.updateCart));
router.delete("", asyncHandler(cartController.deleteCart));

module.exports = router;
