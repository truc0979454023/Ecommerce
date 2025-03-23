"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

//get object allow fields
const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

// ["a","b"] => {a:1,b:1}
const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

// ["a","b"] => {a:0,b:0}
const getUnselectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefindedAndNullObject = (obj) => {
  Object.keys(obj).forEach((k) => {
    if (obj[k] === null) {
      delete obj[k];
    }
  });
  return obj;
};

/* convert from
a={
  c:{
    d:1,
    e:2
  }
}
  to 
a={
 `c.d`= 1,
 `c.e = 2,
}
*/
const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((k) => {
    if (typeof obj[k] === "object" && !Array.isArray(obj[k])) {
      const response = updateNestedObjectParser(obj[k]);
      Object.keys(response).forEach((k1) => {
        final[`${k}.${k1}`] = response[k1];
      });
    } else {
      final[k] = obj[k];
    }
  });
  return final;
};

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

module.exports = {
  getInfoData,
  getSelectData,
  getUnselectData,
  removeUndefindedAndNullObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
};
