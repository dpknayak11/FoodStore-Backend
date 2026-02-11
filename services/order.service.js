const Order = require("../models/order.model");
const { resultDb } = require("../utils/globalFunction");
const { DATA_NULL } = require("../utils/constants");
const moment = require("moment-timezone");


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

const updateOrderStatus = async ({ userId, _id, status }) => {
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
      { userId: userId, _id: _id },
      { status },
      { new: true },
    );
    return resData ? resultDb(true, resData) : resultDb(false, DATA_NULL);
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return resultDb(false, DATA_NULL);
  }
};

const autoUpdateOrderStatus = async (userId) => {
  try {
    const now = moment().tz("Asia/Kolkata");
    const orders = await Order.find({
      userId: userId,
      status: { $in: ["received", "preparing", "out_for_delivery"] },
    });
    let updatedCount = 0;
    for (const order of orders) {
      const orderTime = moment(order.createdAt).tz("Asia/Kolkata");
      const minutesPassed = now.diff(orderTime, "minutes");
      let newStatus = order.status;
      if (minutesPassed >= 15 && order.status !== "delivered") {
        newStatus = "delivered";
      } else if (minutesPassed >= 10 && order.status === "preparing") {
        newStatus = "out_for_delivery";
      } else if (minutesPassed >= 5 && order.status === "received") {
        newStatus = "preparing";
      }
      if (newStatus !== order.status) {
        order.status = newStatus;
        await order.save();
        updatedCount++;
      }
    }
    console.log(`✅ Auto-updated orders: ${updatedCount}`);
    return true;
  } catch (error) {
    console.error("Error in autoUpdateOrderStatus:", error);
    return false;
  }
};

module.exports = {
  getOrderByOne,
  saveOrder,
  getAllOrder,
  updateOrderStatus,
  autoUpdateOrderStatus,
};
