"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const discountController = require("../../controllers/discount.controller");
const router = express.Router();

router.get(
  "/user",
  asyncHandler(discountController.getAllDiscountCodeWithProductForUser)
);
router.post("/amount", asyncHandler(discountController.getDiscountAmount));

//authentication
router.use(authentication);

router.get(
  "/shop",
  asyncHandler(discountController.getAllDiscountCodeWithProductForShop)
);
router.post("/create", asyncHandler(discountController.createDiscount));
router.patch(
  "update/:discountId",
  asyncHandler(discountController.updateDiscount)
);
router.delete("/delete", asyncHandler(discountController.deleteDiscountCode));
router.patch("/cancel", asyncHandler(discountController.cancelDiscountCode));

module.exports = router;
