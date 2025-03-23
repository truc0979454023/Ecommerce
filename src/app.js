const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const app = express();

//init middlewares
//morgan package in log khi user run request
//helmet package ngăn chặn bên thứ 3 xâm nhập lấy thông tin riêng tư
//compression package giảm băng thông khi truyền dữ liệu
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

//init db
require("./dbs/init.mongodb");

//connect redis
const initRedis = require("./dbs/init.redis");
initRedis.initRedis();
//
// const { checkOverload } = require("./helpers/check.connect");
// checkOverload();

//Test pub/sub redis
require("./tests/inventory.test");
const productTest = require("./tests/product.test");
productTest.purchaseProduct({ productId: "product:001", quantity: 10 });

//init route
app.use("/", require("./routes"));

// handle error
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
