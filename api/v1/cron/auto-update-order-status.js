require("dotenv").config();
const moment = require("moment-timezone");
const mongoose = require("mongoose");
const Order = require("../../../models/order.model");

// MongoDB connection
async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  try {
    await mongoose.connect(process.env.DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    throw error;
  }
}

/**
 * Vercel Serverless Function: Auto-update order status based on time elapsed
 * This function is called by an external cron service every 5 minutes
 */
module.exports = async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      error: "Method Not Allowed. Only GET requests are supported.",
    });
  }

  // Verify authorization header
  const authHeader = req.headers.authorization;
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (!authHeader || authHeader !== expectedToken) {
    console.warn("❌ Unauthorized cron request - invalid or missing token");
    return res.status(401).json({
      success: false,
      error: "Unauthorized. Invalid or missing authorization token.",
    });
  }

  try {
    // Connect to MongoDB
    await connectDB();

    // Get current time in Asia/Kolkata timezone
    const now = moment().tz("Asia/Kolkata");
    console.log("🕒 Cron running at:", now.format("DD/MM/YYYY hh:mm A"));

    // Fetch orders that are in progress
    const orders = await Order.find({
      status: { $in: ["received", "preparing", "out_for_delivery"] },
    });

    console.log(`📦 Found ${orders.length} orders to process`);

    let updatedCount = 0;

    // Process each order
    for (const order of orders) {
      try {
        // Parse order creation time (format: "M/D/YYYY, h:mm A")
        const orderTime = moment.tz(
          order.createdTime,
          "M/D/YYYY, h:mm A",
          "Asia/Kolkata"
        );

        // Calculate minutes elapsed since order creation
        const minutesPassed = now.diff(orderTime, "minutes");

        let newStatus = order.status;

        // Update status based on time elapsed
        if (minutesPassed >= 15 && order.status !== "delivered") {
          newStatus = "delivered";
        } else if (minutesPassed >= 10 && order.status === "preparing") {
          newStatus = "out_for_delivery";
        } else if (minutesPassed >= 5 && order.status === "received") {
          newStatus = "preparing";
        }

        // Save changes if status changed
        if (newStatus !== order.status) {
          order.status = newStatus;
          await order.save();
          updatedCount++;
          console.log(
            `✅ Order ${order._id} updated: ${order.status} → ${newStatus}`
          );
        }
      } catch (orderError) {
        console.error(
          `⚠️ Error processing order ${order._id}:`,
          orderError.message
        );
        // Continue processing other orders even if one fails
      }
    }

    console.log(
      `✅ Cron job completed: ${updatedCount} orders status updated out of ${orders.length}`
    );

    return res.status(200).json({
      success: true,
      message: "Cron job executed successfully",
      totalOrders: orders.length,
      updatedOrders: updatedCount,
      timestamp: now.format("DD/MM/YYYY hh:mm A"),
    });
  } catch (error) {
    console.error("❌ Cron error:", error.message);
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
      message: error.message,
    });
  }
};
