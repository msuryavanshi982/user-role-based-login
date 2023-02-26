const mongoose = require("mongoose");

const isValidName = (value) => {
  if (typeof value === "undefined" || value === null || value == "")
    return false;
  if (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.match(/^[a-zA-Z]*$/)
  )
    return true;
  return false;
};

const isValidPass = (value) => {
  if (
    value.match(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/
    )
  )
    return true;
  return false;
};

const isValidObjectId = (value) => {
  return mongoose.Types.ObjectId.isValid(value);
};

const isValidRequestBody = (value) => {
  return Object.keys(value).length > 0;
};

const isValid = (value) => {
  if (typeof value === "undefined" || typeof value === "null") return true;
  if (typeof value === "string" && value.trim().length === 0) return true;
  if (typeof value === "object" && Object.keys(value).length === 0) return true;
  return false;
};

const isValiddesignation = (value) => {
  let arr = ["admin", "supervisor"];
  let inc = arr.includes(value);
  if (!inc) {
    return false;
  }
  return true;
};

const isValidProductId = (value) => {
  if (value.match(/PID\d+/)) return true;
  return false;
};

const isValidPrice = function (value) {
  return /^\d*\.?\d*$/.test(value);
};

module.exports = {
  isValid,
  isValidObjectId,
  isValidRequestBody,
  isValidName,
  isValidPass,
  isValiddesignation,
  isValidProductId,
  isValidPrice,
};
