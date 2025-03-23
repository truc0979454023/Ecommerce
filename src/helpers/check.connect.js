"use strict";

const mongoose = require("mongoose");
const os = require("os");
const process = require("process");
const _SECOND = 5000;

//check connect
const countConnect = () => {
  const numConnection = mongoose.connections.length;
  console.log(`Number of Connections::${numConnection}`);
};

//check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    // example maxium number of connection based on numnber osf cores
    const maxConnecttions = numCores * 5;
    console.log(`Active Connection::${numConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);
    if (numConnection > maxConnecttions) {
      console.log("Connection Overload Deteted");
      //notify.send(...)
    }
  }, _SECOND); //moniter every 5 seconds
};

module.exports = {
  countConnect,
  checkOverload,
};
