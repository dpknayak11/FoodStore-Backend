// ================== IMPORTS ==================
const Razorpay = require("razorpay");
const crypto = require("crypto");
require("dotenv").config();

const Payment = require("../models/paymentModel.js");
const { createOrder } = require("../services/orderService.js");
const { getUserById } = require("../services/userService.js");
const CONSTANTS_MSG = require("../utils/constantsMessage");

// ================== RAZORPAY INSTANCE ==================
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// =======================================================
// 🧾 STEP 1 — CREATE RAZORPAY ORDER (Before Payment)
// =======================================================
const checkout = async (req, res) => {
  try {
    const { amount } = req.body; // Amount from frontend
    const currency = "INR";
    // Razorpay expects amount in paise (₹1 = 100 paise)
    const options = {
      amount: Number(amount * 100),
      currency,
    };
    // Create Razorpay order
    const order = await razorpayInstance.orders.create(options);
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Checkout Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// =======================================================
// 💳 STEP 2 — VERIFY PAYMENT & SAVE ORDER
// =======================================================
const paymentVerification = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      selectedOrder, // Cart + Address details from frontend
      userId,
    } = req.body;

    // 🔐 Verify Razorpay Signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    // 👤 Check if user exists
    const existingUser = await getUserById(userId);
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        message: CONSTANTS_MSG.USER_ERROR,
      });
    }

    // ❌ If signature mismatch
    if (!isAuthentic) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }

    // ===================================================
    // 💾 Save Payment Details in DB
    // ===================================================
    const paymentData = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount: selectedOrder.allTotalPrice,
      currency: "INR",
      status: "Paid",
    };

    const paymentDone = await new Payment(paymentData).save();

    // ===================================================
    // 📦 Create Order in DB after successful payment
    // ===================================================
    const orderData = {
      userId,
      items: selectedOrder.cartProduct,
      allTotalPrice: selectedOrder.allTotalPrice,
      address: selectedOrder.address,
      paymentMethod: "Razorpay",
      paymentId: paymentDone.razorpay_payment_id,
    };

    const order = await createOrder(orderData);

    // ===================================================
    // ✅ Final Success Response
    // ===================================================
    res.status(200).json({
      success: true,
      message: "Payment verified & order created successfully",
      data: {
        paymentId: paymentDone.razorpay_payment_id,
        order,
      },
    });
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// ================== EXPORT ==================
module.exports = {
  checkout,
  paymentVerification,
};
