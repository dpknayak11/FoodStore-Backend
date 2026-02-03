const userService = require('../services/user.service');
const { apiSuccessRes, apiErrorRes } = require('../utils/globalFunction');
const MESSAGES = require('../utils/constantsMessage');
const { SUCCESS, SERVER_ERROR, NOT_FOUND } = require('../utils/constants');

const getProfile = async (req, res) => {
  const result = await userService.getUserById(req.user._id);
  if (result.statusCode === SUCCESS) return apiSuccessRes(req, res, SUCCESS, MESSAGES.USER_PROFILE_FETCHED, result.data);
  return apiErrorRes(req, res, NOT_FOUND, MESSAGES.USER_NOT_FOUND, null);
};

const updateProfile = async (req, res) => {
  const result = await userService.updateUser(req.user._id, req.body);
  if (result.statusCode === SUCCESS) return apiSuccessRes(req, res, SUCCESS, MESSAGES.UPDATED, result.data);
  return apiErrorRes(req, res, SERVER_ERROR, MESSAGES.FAILURE, null);
};

module.exports = { getProfile, updateProfile };