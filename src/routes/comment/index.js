"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authentication } = require("../../auth/authUtils");
const commentController = require("../../controllers/comment.controller");
const router = express.Router();

router.use(authentication);

router.get("/", asyncHandler(commentController.getCommentsByParentId));
router.post("/", asyncHandler(commentController.createComment));
router.delete("/", asyncHandler(commentController.deleteComments));

module.exports = router;
