"use strict";

const redis = require("redis");
const { RedisErrorResponse } = require("../core/error.response");

let client = {};
let statusConnectRedis = {
  CONNECT: "connect",
  END: "end",
  RECONNECT: "reconnect",
  ERROR: "error",
};
let connectionTimeout;

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisErrorResponse(
      REDIS_CONNECT_MESSAGE.message.vn,
      REDIS_CONNECT_MESSAGE.code
    );
  }, REDIS_CONNECT_TIMEOUT);
};

const handleEvnentConnection = ({ connectionRedis }) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log(`connectionRedis - Connection status: connected`);
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(statusConnectRedis.END, () => {
    console.log(`connectionRedis - Connection status: end`);
    handleTimeoutError();
  });
  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log(`connectionRedis - Connection status: reconnect`);
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log(`connectionRedis - Connection status: err ${err}`);
    handleTimeoutError();
  });
};

const REDIS_CONNECT_TIMEOUT = 1000;
const REDIS_CONNECT_MESSAGE = {
  code: -99,
  message: {
    vn: "Redis lỗi rồi",
    en: "Redis connection error",
  },
};

const initRedis = () => {
  const instanceRedis = redis.createClient();
  client.instanceConnect = instanceRedis;
  handleEvnentConnection({ connectionRedis: instanceRedis });
};

const getRedis = () => client;

const closeRedis = () => client.quit();

module.exports = {
  initRedis,
  getRedis,
  closeRedis,
};
