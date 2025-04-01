const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const { default: helmet } = require("helmet");
const compression = require("compression");
const cors = require("cors");
const app = express();
const { v4: uuidv4 } = require("uuid");
const myLogger = require("./loggers/mylogger.log");

const corsOptions = {
  origin: "https://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));

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

app.use((req, res, next) => {
  const requestId = req.headers["x-request-id"];
  req.requestId = requestId ? requestId : uuidv4();
  myLogger.log(`input params ::${req.method}`, [
    req.path,
    { requestId: req.requestId },
    req.method === "POST" ? req.body : req.query,
  ]);
  next();
});

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
const { method } = require("lodash");
const { credentials } = require("amqplib");
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

  const resMessage = `${error.status} - ${
    Date.now() - error.now
  }ms - Response: ${JSON.stringify(error)}`;
  myLogger.error(resMessage, [
    req.path,
    { requestId: req.requestId },
    {
      message: error.message,
    },
  ]);
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    stack: error.stack,
    message: error.message || "Internal Server Error",
  });
});

module.exports = app;
