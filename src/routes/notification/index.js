"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const notificationController = require("../../controllers/notification.controller");
const router = express.Router();
const { authentication } = require("../../auth/authUtils");

//authentication
router.use(authentication);

router.get("/", asyncHandler(notificationController.listNotificationByUser));

module.exports = router;
