"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const rbacController = require("../../controllers/rbac.controller");
const router = express.Router();

// router.use(authentication);

router.post("/role", asyncHandler(rbacController.createRole));
router.get("/role", asyncHandler(rbacController.getListRole));

router.post("/resource", asyncHandler(rbacController.createResource));
router.get("/resource", asyncHandler(rbacController.getListResource));

module.exports = router;
