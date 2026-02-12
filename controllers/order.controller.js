require("dotenv").config();
const crypto = require("crypto");
const Razorpay = require("razorpay");
const orderService = require("../services/order.service");
const Order = require("../models/order.model");
const { apiSuccessRes, apiErrorRes } = require("../utils/globalFunction");
const CONSTANTS_MSG = require("../utils/constantsMessage");
const {
  SUCCESS,
  CREATED,
  NOT_FOUND,
  SERVER_ERROR,
  BAD_REQUEST,
} = require("../utils/constants");

// ==================== INITIALIZE RAZORPAY ====================
let razorpayInstance;
try {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials not found in environment variables");
  }
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  console.log("✅ Razorpay instance initialized successfully");
} catch (error) {
  console.error("❌ Razorpay initialization error:", error.message);
  razorpayInstance = null;
}

const getAllOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    // 🔥 Step 1: Update order statuses before fetching
    await orderService.autoUpdateOrderStatus(userId);
    const order = await orderService.getAllOrder({ userId: userId });
    if (!order.status || !order.data.length) {
      return apiErrorRes(req, res, NOT_FOUND, CONSTANTS_MSG.ORDER_NOT_FOUND);
    }
    return apiSuccessRes(
      req,
      res,
      SUCCESS,
      CONSTANTS_MSG.ORDER_FETCHED,
      order.data,
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const result = await orderService.updateOrderStatus({
      userId: req.user._id,
      _id: id,
      status,
    });

    if (!result.status) {
      return apiErrorRes(req, res, NOT_FOUND, CONSTANTS_MSG.ORDER_NOT_FOUND);
    }

    return apiSuccessRes(
      req,
      res,
      SUCCESS,
      CONSTANTS_MSG.ORDER_STATUS_UPDATED,
      result.data,
    );
  } catch (error) {
    console.error("Error updating order status:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};

// ==================== COD ORDER CREATION ====================

const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, deliveryInfo, subtotal, deliveryFee, total, meta } =
      req.body;
    if (!items?.length || !deliveryInfo) {
      return apiErrorRes(
        req,
        res,
        BAD_REQUEST,
        "Items and delivery info required",
      );
    }
    const orderPayload = {
      userId,
      items,
      deliveryInfo,
      subtotal,
      deliveryFee,
      total,
      status: "received",
      paymentMethod: "COD",
      meta: meta || {},
    };
    const order = await orderService.saveOrder(orderPayload);
    if (!order.status) {
      return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.ORDER_CREATED);
    }
    return apiSuccessRes(
      req,
      res,
      CREATED,
      CONSTANTS_MSG.ORDER_PLACED,
      order.data,
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};

// ==================== INTERNAL ORDER CREATION ====================
// Used after payment verification to save order to database
const saveOrderToDatabase = async (orderPayload) => {
  try {
    const order = await Order.create(orderPayload);
    return {
      status: true,
      order,
      message: CONSTANTS_MSG.ORDER_PLACED,
    };
  } catch (error) {
    console.error("Error saving order to database:", error);
    return {
      status: false,
      data: null,
      message: CONSTANTS_MSG.SERVER_ERROR,
    };
  }
};

// =======================================================
// 🧾 STEP 1 — CREATE RAZORPAY ORDER (Before Payment)
// =======================================================
const checkout = async (req, res) => {
  try {
    if (!razorpayInstance) {
      return apiErrorRes(
        req,
        res,
        SERVER_ERROR,
        "Razorpay is not configured properly",
      );
    }
    const { amount } = req.body;
    if (!amount || amount <= 0) {
      return apiErrorRes(req, res, BAD_REQUEST, "Valid amount is required");
    }
    const currency = "INR";
    // Razorpay expects amount in paise (₹1 = 100 paise)
    const options = {
      amount: Math.round(amount * 100),
      currency,
      receipt: `receipt_${Date.now()}`,
    };
    // Create Razorpay order
    const order = await razorpayInstance.orders.create(options);
    return apiSuccessRes(
      req,
      res,
      SUCCESS,
      "Razorpay order created successfully",
      order,
    );
  } catch (error) {
    console.error("❌ Checkout Error:", error.message);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};
// =======================================================
// 💳 STEP 2 — VERIFY PAYMENT & SAVE ORDER
// =======================================================
const paymentVerification = async (req, res) => {
  try {
    if (!razorpayInstance) {
      return apiErrorRes(
        req,
        res,
        SERVER_ERROR,
        "Razorpay is not configured properly",
      );
    }
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !orderData
    ) {
      return apiErrorRes(
        req,
        res,
        BAD_REQUEST,
        "Missing payment verification details",
      );
    }
    // Verify Razorpay Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");
    const isAuthentic = expectedSignature === razorpay_signature;
    // If signature mismatch - Payment is fraudulent
    if (!isAuthentic) {
      console.error("❌ Invalid Razorpay signature detected");
      return apiErrorRes(
        req,
        res,
        BAD_REQUEST,
        "Payment signature verification failed",
      );
    }

    // ✅ Signature verified - Payment is authentic
    console.log("✅ Payment signature verified successfully");

    // ===================================================
    // 📦 Create Order in DB after successful payment
    // ===================================================
    const payloadData = {
      userId,
      items: orderData.items,
      deliveryInfo: orderData.deliveryInfo,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      total: orderData.total,

      paymentMethod: "ONLINE",
      paymentId: razorpay_payment_id,
      paymentStatus: "Paid",
      status: "received",
      meta: {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      },
    };

    const savedOrder = await saveOrderToDatabase(payloadData);
    if (!savedOrder.status) {
      return apiErrorRes(req, res, SERVER_ERROR, savedOrder.message);
    }
    // ===================================================
    // ✅ Final Success Response
    // ===================================================
    return apiSuccessRes(
      req,
      res,
      CREATED,
      "Payment verified & order created successfully",
      {
        paymentId: razorpay_payment_id,
        orderId: savedOrder._id,
        amount: orderData.total,
        status: "success",
      },
    );
  } catch (error) {
    console.error("❌ Payment Verification Error:", error.message);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};

module.exports = {
  getAllOrder,
  updateOrderStatus,
  createOrder,
  checkout,
  paymentVerification,
};
