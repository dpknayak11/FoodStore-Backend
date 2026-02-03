const orderService = require('../services/order.service');
const { apiSuccessRes, apiErrorRes } = require('../utils/globalFunction');
const MESSAGES = require('../utils/constantsMessage');
const { SUCCESS, CREATED, NOT_FOUND, SERVER_ERROR } = require('../utils/constants');

const createOrder = async (req, res) => {
  const payload = req.body;
  const result = await orderService.createOrder(req.user._id, payload);
  if (result.statusCode === CREATED) return apiSuccessRes(req, res, CREATED, MESSAGES.ORDER_CREATED, result.data);
  return apiErrorRes(req, res, SERVER_ERROR, MESSAGES.FAILURE, null);
};

const getOrdersForUser = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await orderService.getOrdersForUser(req.user._id, { page: Number(page), limit: Number(limit) });
  if (result.statusCode === SUCCESS) return apiSuccessRes(req, res, SUCCESS, MESSAGES.SUCCESS, result.data);
  return apiErrorRes(req, res, SERVER_ERROR, MESSAGES.FAILURE, null);
};

const getOrderById = async (req, res) => {
  const result = await orderService.getOrderById(req.params.id);
  if (result.statusCode === SUCCESS) {
    const order = result.data;
    if (String(order.user) !== String(req.user._id) && req.user.role !== 'admin') {
      return apiErrorRes(req, res, 403, MESSAGES.FORBIDDEN, null);
    }
    return apiSuccessRes(req, res, SUCCESS, MESSAGES.SUCCESS, order);
  }
  return apiErrorRes(req, res, result.statusCode || SERVER_ERROR, MESSAGES.ORDER_NOT_FOUND, null);
};

const updateOrderStatus = async (req, res) => {
  const { status } = req.body;
  const result = await orderService.updateOrderStatus(req.params.id, status);
  if (result.statusCode === SUCCESS) return apiSuccessRes(req, res, SUCCESS, MESSAGES.ORDER_STATUS_UPDATED, result.data);
  return apiErrorRes(req, res, result.statusCode || SERVER_ERROR, MESSAGES.FAILURE, null);
};

module.exports = { createOrder, getOrdersForUser, getOrderById, updateOrderStatus };
