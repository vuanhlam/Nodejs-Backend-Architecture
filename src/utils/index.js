"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const convertToObjectIdMongodb = (id) => new Types.ObjectId(id);

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unGetSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (obj) => {
  console.log("[1]::", obj);
  Object.keys(obj).forEach((key) => {
    if (obj[key] === null || obj[key] === undefined) {
      delete obj[key];
    }
    if (obj[key] && typeof obj[key] === "object") {
      removeUndefinedObject(obj[key]);
    }
  });
  console.log("[2]::", obj);
  return obj;
};

/**
 const a = { 
    c: {
      d: 1
      e: 2
    }
 }

 db.collection.updateOne({
  `c.d`: 1
  `c.e`: 2
 })

*/
const updateNestedObjectParser = (obj) => {
  const final = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const response = updateNestedObjectParser(obj[key]);
      Object.keys(response).forEach((a) => {
        final[`${key}.${a}`] = response[a];
      });
    } else {
      final[key] = obj[key];
    }
  });
  return final;
};

module.exports = {
  getInfoData,
  removeUndefinedObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
  getSelectData,
  unGetSelectData,
};
