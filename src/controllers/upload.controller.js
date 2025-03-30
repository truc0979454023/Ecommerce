"use strict";

const { BadRequestError } = require("../core/error.response");
const { SuccessResponse } = require("../core/success.response");
const UploadService = require("../services/upload.service");

class UploadController {
  //SHOP

  uploadImageFromUrl = async (req, res, next) => {
    new SuccessResponse({
      message: "Upload file Success",
      metaData: await UploadService.uploadImageFromUrl(),
    }).send(res);
  };

  uploadImageFromLocal = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File missing");
    }
    new SuccessResponse({
      message: "Upload file Success",
      metaData: await UploadService.uploadImageFromLocal({
        path: file.path,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  uploadMultiImageFromLocal = async (req, res, next) => {
    const { files } = req;
    if (!files.length) {
      throw new BadRequestError("File missing");
    }
    new SuccessResponse({
      message: "Upload file Success",
      metaData: await UploadService.uploadMultiImageFromLocal({
        files,
        shopId: req.user.userId,
      }),
    }).send(res);
  };

  uploadImageFromLocalToS3Client = async (req, res, next) => {
    const { file } = req;
    if (!file) {
      throw new BadRequestError("File missing");
    }
    new SuccessResponse({
      message: "Upload file Success",
      metaData: await UploadService.uploadImageFromLocalToS3Client({
        file,
      }),
    }).send(res);
  };
}

module.exports = new UploadController();
