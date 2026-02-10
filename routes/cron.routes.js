// routes/cron.routes.js
const express = require("express");
const moment = require("moment-timezone");
const router = express.Router();
const Order = require("../models/order.model");

// 🔄 Auto update order status
router.get("/auto-update-order-status", async (req, res) => {
  try {
    const now = moment().tz("Asia/Kolkata");
    console.log("🕒 Cron running at:", now.format("DD/MM/YYYY hh:mm A"));
    const orders = await Order.find({
      status: { $in: ["received", "preparing", "out_for_delivery"] },
    });

    let updatedCount = 0;

    for (const order of orders) {
      const orderTime = moment.tz(order.createdTime, "M/D/YYYY, h:mm A", "Asia/Kolkata");
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
    console.log(`✅ Orders status updated: ${updatedCount}`);
    return res.status(200).json({ success: true, updated: updatedCount });
  } catch (error) {
    console.error("❌ Cron error:", error.message);
    return res.status(500).json({ success: false });
  }
});

module.exports = router;
