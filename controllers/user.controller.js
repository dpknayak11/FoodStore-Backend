require("dotenv").config();
const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcryptjs");
const serviceUser = require("../services/user.service");
const { generateToken } = require("../middleware/auth.middleware");
const CONSTANTS_MSG = require("../utils/constantsMessage");
const {
  SUCCESS,
  CREATED,
  NOT_FOUND,
  SERVER_ERROR,
  DUPLICATE_ERROR,
  UNAUTHORIZED,
  DATA_NULL,
  BAD_REQUEST,
} = require("../utils/constants");
const { apiErrorRes, apiSuccessRes } = require("../utils/globalFunction");

const register = async (req, res) => {
  try {
    // Check if user already exists
    const userData = await serviceUser.getUserByOne({ email: req.body.email });
    if (userData.status === true) {
      return apiErrorRes(
        req,
        res,
        DUPLICATE_ERROR,
        CONSTANTS_MSG.EMAIL_ALREADY_EXISTS,
      );
    }

    // Prepare data to save
    const saveUserData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    // Save new user
    const newUser = await serviceUser.saveUser(saveUserData);

    if (newUser.status === true) {
      const userToken = await generateToken(newUser.data);

      return apiSuccessRes(req, res, CREATED, CONSTANTS_MSG.USER_REGISTERED, {
        token: userToken,
        data: newUser.data,
      });
    }

    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  } catch (error) {
    console.error("Register Error:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};

const login = async (req, res) => {
  try {
    // Check if user exists
    const userData = await serviceUser.getUserByOne({ email: req.body.email });

    if (!userData.status) {
      return apiErrorRes(req, res, NOT_FOUND, CONSTANTS_MSG.USER_NOT_FOUND);
    }

    // Compare password
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      userData.data.password,
    );
// console.log("isPasswordValid",isPasswordValid);

    if (!isPasswordValid) {
      return apiErrorRes(
        req,
        res,
        NOT_FOUND,
        CONSTANTS_MSG.INVALID_CREDENTIALS
      );
    }

    // Generate token
    const userToken = await generateToken(userData.data);

    return apiSuccessRes(req, res, CREATED, CONSTANTS_MSG.USER_LOGIN, {
      token: userToken,
      data: userData.data,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};
// getProfile

const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const userData = await serviceUser.getUserByOne({ _id: userId });
    if (!userData.status) {
      return apiErrorRes(req, res, NOT_FOUND, CONSTANTS_MSG.USER_NOT_FOUND);
    }
    return apiSuccessRes(
      req,
      res,
      SUCCESS,
      CONSTANTS_MSG.USER_PROFILE_FETCHED,
      userData.data,
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
