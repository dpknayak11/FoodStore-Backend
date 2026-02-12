const orderService = require("../services/order.service");
const serviceMenu = require("../services/menu.service");
const serviceAddress = require("../services/address.service");
const { apiSuccessRes, apiErrorRes } = require("../utils/globalFunction");
const CONSTANTS_MSG = require("../utils/constantsMessage");
const {
  SUCCESS,
  CREATED,
  NOT_FOUND,
  SERVER_ERROR,
  BAD_REQUEST,
} = require("../utils/constants");

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
      return apiErrorRes(
        req,
        res,
        NOT_FOUND,
        CONSTANTS_MSG.ORDER_NOT_FOUND
      );
    }

    return apiSuccessRes(
      req,
      res,
      SUCCESS,
      CONSTANTS_MSG.ORDER_STATUS_UPDATED,
      result.data
    );

  } catch (error) {
    console.error("Error updating order status:", error);
    return apiErrorRes(
      req,
      res,
      SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR
    );
  }
};

const createOrder = async ({}) => {
  try {
    const userId = req.user._id;
    const { items, deliveryInfo, subtotal, deliveryFee, total, meta } = req.body;
    if (!items?.length || !deliveryInfo) {
      return apiErrorRes(req, res, BAD_REQUEST, "Items and delivery info required");
    }
    const orderPayload = {
      userId,
      items,
      deliveryInfo,
      subtotal,
      deliveryFee,
      total,
      status: "received",
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
      order.data
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};

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
    return apiSuccessRes(req, res, SUCCESS, CONSTANTS_MSG.ORDER_FETCHED, order);
  } catch (error) {
    console.error("Checkout Error:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
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
      orderData,
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
      amount: orderData.total,
      currency: "INR",
      status: "Paid",
    };

    const paymentDone = await new Payment(paymentData).save();
    // ===================================================
    // 📦 Create Order in DB after successful payment
    // ===================================================
    const payloadData = {
      userId,
      paymentId: paymentDone.razorpay_payment_id || "",
      status: "payment_failed" || "received" ,
      orderData
    };

    const order = await createOrder(payloadData);

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



module.exports = {
  createOrder,
  getAllOrder,
  updateOrderStatus,
};
