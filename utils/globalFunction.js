const CONSTANTS = require("./constants");
const CONSTANTS_MSG = require("./constantsMessage");

const resultDb = (status = false, data = null) => {
  return {
    status: status,
    data: data,
  };
};

const apiSuccessRes = (
  req,
  res,
  HTTP = CONSTANTS.SUCCESS,
  message = CONSTANTS_MSG.SUCCESS,
  data = CONSTANTS.DATA_NULL,
  error = CONSTANTS.ERROR_FALSE,
) => {
  return res.status(HTTP).json({
    message: message,
    code: HTTP,
    error: error, // true, false
    data: data,
  });
};

const apiErrorRes = (
  req,
  res,
  HTTP = CONSTANTS.BAD_REQUEST,
  message = CONSTANTS_MSG.FAILURE,
  data = CONSTANTS.DATA_NULL,
  error = CONSTANTS.ERROR_TRUE,
) => {
  return res.status(HTTP).json({
    message: message,
    code: HTTP,
    error: error, // true, false
    data: data,
  });
};

module.exports = {
  resultDb,
  apiSuccessRes,
  apiErrorRes,
};
