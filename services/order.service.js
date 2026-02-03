const Order = require("../models/order.model");
const { resultDb } = require("../utils/globalFunction");
const { DATA_NULL } = require("../utils/constants");

const getOrderById = async (query) => {
  try {
    const user = await Order.findById(query).lean();
    return user ? resultDb(true, user) : resultDb(false, DATA_NULL);
  } catch (err) {
    console.error("Order.getOrderById error:", err);
    return resultDb(false, DATA_NULL);
  }
};

// Get Order by ID
const getOrderByOne = async (query) => {
  try {
    const resData = await Order.findOne(query);
    return resData ? resultDb(true, resData) : resultDb(false, DATA_NULL);
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return resultDb(false, DATA_NULL);
  }
};

// Save Order
const saveOrder = async (data) => {
  try {
    const resData = new Order(data);
    await resData.save();
    return resultDb(true, resData);
  } catch (error) {
    console.error("Error in saveOrder:", error);
    return resultDb(false, DATA_NULL);
  }
};

// Get All Orders by User ID
const getAllOrderByUserId = async (query) => {
  try {
    const resData = await Order.find(query)
      .sort({ createdAt: -1 })
      .lean();
    return resData.length > 0
      ? resultDb(true, resData)
      : resultDb(false, DATA_NULL);
  } catch (error) {
    console.error("Error in getAllOrdersByUserId:", error);
    return resultDb(false, DATA_NULL);
  }
};

// Delete Order
const deleteOrder = async (query) => {
  try {
    const resData = await Order.deleteOne(query);
    return resData.deletedCount === 0
      ? resultDb(false, DATA_NULL)
      : resultDb(true);
  } catch (error) {
    console.error("Error in deleteOrder:", error);
    return resultDb(false, DATA_NULL);
  }
};

module.exports = {
  getOrderByOne,
  saveOrder,
  getAllOrderByUserId,
  deleteOrder,
  getOrderById,
};
