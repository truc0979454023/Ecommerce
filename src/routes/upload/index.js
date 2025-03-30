"use strict";

const express = require("express");
const { asyncHandler } = require("../../helpers/asyncHandler");
const uploadController = require("../../controllers/upload.controller");
const { uploadDisk, uploadMemory } = require("../../configs/multer.config");
const { authentication } = require("../../auth/authUtils");
const router = express.Router();

router.post("/uploadURL", asyncHandler(uploadController.uploadImageFromUrl));

router.use(authentication);
router.post(
  "/uploadDisk",
  uploadDisk.single("file"),
  asyncHandler(uploadController.uploadImageFromLocal)
);

router.post(
  "/uploadDisk/multiple",
  uploadDisk.array("files", 3),
  asyncHandler(uploadController.uploadMultiImageFromLocal)
);

router.post(
  "/uploadDiskS3",
  uploadMemory.single("file"),
  asyncHandler(uploadController.uploadImageFromLocalToS3Client)
);

module.exports = router;
