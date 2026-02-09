const Order = require("../models/order.model");
const { resultDb } = require("../utils/globalFunction");
const { DATA_NULL } = require("../utils/constants");

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
const getAllOrder = async (query) => {
  try {
    const resData = await Order.find(query).sort({ createdAt: -1 }).lean();
    return resData.length > 0
      ? resultDb(true, resData)
      : resultDb(false, DATA_NULL);
  } catch (error) {
    console.error("Error in getAllOrdersByUserId:", error);
    return resultDb(false, DATA_NULL);
  }
};

const updateOrderStatus = async ({ userId, orderId, status }) => {
  try {
    // const allowedStatuses = [
    //   "received",
    //   "preparing",
    //   "out_for_delivery",
    //   "delivered",
    //   "cancelled",
    // ];

    // // ❌ Invalid status check
    // if (!allowedStatuses.includes(status)) {
    //   return resultDb(false, "Invalid status value");
    // }
    const resData = await Order.findOneAndUpdate(
      { userId: userId, _id: orderId },
      { status },
      { new: true },
    );
    return resData ? resultDb(true, resData) : resultDb(false, DATA_NULL);
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return resultDb(false, DATA_NULL);
  }
};

module.exports = {
  getOrderByOne,
  saveOrder,
  getAllOrder,
  updateOrderStatus,
};
