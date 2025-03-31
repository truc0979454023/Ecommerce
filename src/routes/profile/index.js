"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const grantAccess = require("../../middlewares/rbac");
const { profiles, profile } = require("../../controllers/profle.controller");
const router = express.Router();

// router.use(authentication);

// admin
router.get("/viewAny", grantAccess("readAny", "profile"), profiles);

//shop
router.get("/viewOwn", grantAccess("readOwn", "profile"), profile);

module.exports = router;
