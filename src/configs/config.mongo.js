"use strict";

const dev = {
  app: {
    port: process.env.DEV_APP_PORT,
  },
  db: {
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    name: process.env.DEV_DB_NAME,
  },
};

const production = {
  app: {
    port: process.env.PRODUCTION_APP_PORT,
  },
  db: {
    host: process.env.PRODUCTION_DB_HOST,
    port: process.env.PRODUCTION_DB_PORT,
    name: process.env.PRODUCTION_DB_NAME,
  },
};
const config = { dev, production };
const env = process.env.NODE_END || "dev";
module.exports = config[env];
