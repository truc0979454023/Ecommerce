"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const checkoutControler = require("../../controllers/checkout.controler");
const router = express.Router();

router.post("/review", asyncHandler(checkoutControler.checkoutReview));

module.exports = router;
