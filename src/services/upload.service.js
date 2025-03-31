"use strict";

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const cloudinary = require("../configs/cloudinary.config");
const { PutObjectCommand, GetObjectCommand } = require("../configs/s3.config");
const crypto = require("crypto");

const urlImagePublic = `https://link.cloudfront.net`; // link lay tu cloudFront session 69 nodejs tips

const randomImageName = () => crypto.randomBytes(16).toString("hex");
class UploadService {
  // chưa học bài này Section 69: AWS CloudFront Bảo mật File ngăn cấm hành vi sao chép phía BackEnd
  //1. upload from url image
  static uploadImageFromUrl = async () => {
    try {
      const urlImage =
        "https://down-vn.img.susercontent.com/file/d4e14f20fbcb6e42c2adc631536ca1c9";
      const folderName = "product/shopId";
      const newFileName = "testDemo";

      const result = await cloudinary.uploader.upload(urlImage, {
        public_id: newFileName,
        folder: folderName,
      });

      return result;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  //2. upload from local image
  static uploadImageFromLocal = async ({
    path,
    folderName = "product/shopId",
    shopId,
  }) => {
    try {
      const result = await cloudinary.uploader.upload(path, {
        // public_id: "thumb",
        folder: folderName,
      });
      return {
        image_url: result.secure_url,
        shopId: shopId,
        thumb_url: await cloudinary.url(result.public_id, {
          height: 100,
          width: 100,
          format: "jpg",
        }),
      };
    } catch (error) {
      console.log(error);
    }
  };

  //3. upload from local multi image
  static uploadMultiImageFromLocal = async ({
    files,
    folderName = "product/shopId",
    shopId,
  }) => {
    try {
      if (!files.length) return;
      const uploadedUrls = [];

      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: folderName,
        });
        uploadedUrls.push({
          image_url: result.secure_url,
          shopId: shopId,
          thumb_url: await cloudinary.url(result.public_id, {
            height: 100,
            width: 100,
            format: "jpg",
          }),
        });
      }
      return uploadedUrls;
    } catch (error) {
      console.log(error);
    }
  };

  // 3. upload file use S3Client
  static uploadImageFromLocalToS3Client = async ({ file }) => {
    try {
      const imageNameRamdom = randomImageName();
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageNameRamdom,
        Body: file.buffer,
        ContentType: "image/jpeg", //that is that you need
      });

      //send image to s3 but not public url image
      const result = await s3.send(command);

      //public url
      const singleUrl = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: imageNameRamdom,
      });
      const url = await getSignedUrl(s3, singleUrl, { expiresIn: 36000 });

      return { url: `${urlImagePublic}/${imageNameRamdom}`, result };
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = UploadService;
