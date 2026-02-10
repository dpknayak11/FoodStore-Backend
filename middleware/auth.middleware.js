require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const constants = require("../utils/constantsMessage");
const { apiErrorRes } = require("../utils/globalFunction");
const { JWT_SECRET_KEY } = process.env;
const { UNAUTHORIZED, DATA_NULL } = require("../utils/constants");

const generateToken = (user) => {
  return jwt.sign({ userId: user._id }, JWT_SECRET_KEY, {
    expiresIn: "30d",
  });
};

const isAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  try {
    // Token header check
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return apiErrorRes(
        req,
        res,
        UNAUTHORIZED,
        constants.UNAUTHORIZED_NO_TOKEN,
        DATA_NULL,
      );
    }

    //  Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return apiErrorRes(
        req,
        res,
        UNAUTHORIZED,
        constants.UNAUTHORIZED_INVALID_TOKEN,
        DATA_NULL,
      );
    }

    // Verify token
    const verifiedToken = jwt.verify(token, JWT_SECRET_KEY);
    if (!verifiedToken || !verifiedToken.userId) {
      return apiErrorRes(
        req,
        res,
        UNAUTHORIZED,
        constants.UNAUTHORIZED_INVALID_TOKEN,
        DATA_NULL,
      );
    }

    // Find user in DB
    const user = await User.findById({ _id: verifiedToken.userId });
    
    if (!user) {
      return apiErrorRes(
        req,
        res,
        UNAUTHORIZED,
        constants.UNAUTHORIZED_USER_NOT_FOUND,
        DATA_NULL,
      );
    }

    // Attach user to request
    req.user = user;

    // Move to next middleware/controller
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return apiErrorRes(
      req,
      res,
      UNAUTHORIZED,
      constants.UNAUTHORIZED_INVALID_TOKEN,
      DATA_NULL,
    );
  }
};

module.exports = { isAuth, generateToken };
