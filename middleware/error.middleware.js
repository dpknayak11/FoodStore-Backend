const CONSTANTS_STATUS = require("../utils/constants");
const MESSAGES = require("../utils/constantsMessage");
const { apiErrorRes } = require("../utils/globalFunction");

module.exports = (err, req, res, next) => {
  console.error("Unhandled error:", err);

  // Mongoose validation error
  if (err && err.name === "ValidationError") {
    const details = Object.keys(err.errors || {}).reduce((acc, key) => {
      acc[key] = err.errors[key].message || err.errors[key].name;
      return acc;
    }, {});
    return apiErrorRes(
      req,
      res,
      CONSTANTS_STATUS.BAD_REQUEST,
      MESSAGES.VALIDATION_ERROR,
      details,
    );
  }

  // Mongoose cast error (invalid ObjectId)
  if (err && err.name === "CastError") {
    return apiErrorRes(
      req,
      res,
      CONSTANTS_STATUS.BAD_REQUEST,
      "Invalid identifier provided",
      null,
    );
  }

  // Duplicate key (e.g., unique index violation)
  if (err && err.code === 11000) {
    const key = Object.keys(err.keyValue || {})[0];
    const message =
      key === "email"
        ? MESSAGES.EMAIL_ALREADY_EXISTS
        : MESSAGES.RESOURCE_CONFLICT;
    return apiErrorRes(req, res, CONSTANTS_STATUS.CONFLICT, message, null);
  }

  // Custom error with statusCode
  if (err && err.statusCode) {
    return apiErrorRes(
      req,
      res,
      err.statusCode,
      err.message || MESSAGES.FAILURE,
      err.data || null,
    );
  }

  // Fallback -> 500
  return apiErrorRes(
    req,
    res,
    CONSTANTS_STATUS.INTERNAL_SERVER_ERROR,
    MESSAGES.SERVER_ERROR,
    null,
  );
};
