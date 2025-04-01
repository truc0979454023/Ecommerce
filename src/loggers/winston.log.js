"use strict";

const winston = require("winston");

const { combine, timestamp, printf, align } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "debug",

  format: combine(
    timestamp({
      format: "YYYY-MM-DD hh:mm:ss.SSSS A",
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      dirname: "logs",
      filename: "test.log",
    }),
  ],
});

module.exports = logger;
