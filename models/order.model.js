const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { addTimeStamp } = require("../utils/addTimeStamp");


// ================= ORDER ITEM =================
const OrderItemSchema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    notes: { type: String },
  },
  { _id: false }
);


// ================= DELIVERY INFO =================
const DeliveryInfoSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    notes: { type: String },
  },
  { _id: false }
);


// ================= MAIN ORDER SCHEMA =================
const OrderSchema = new Schema({

  // User
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: "User", 
    required: true,
    index: true
  },

  // Ordered Items
  items: { 
    type: [OrderItemSchema], 
    required: true, 
    default: [] 
  },

  // Delivery Info
  deliveryInfo: { 
    type: DeliveryInfoSchema, 
    required: true 
  },

  // Pricing
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true, min: 0 },

  // Order Status
  status: {
    type: String,
    enum: [
      "received",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
      "payment_failed"
    ],
    default: "received",
    index: true
  },

  // Payment Details
  paymentMethod: {
    type: String,
    enum: ["ONLINE", "COD"],
    default: "COD"
  },
  paymentId: {
    type: String,
    default: null
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending"
  },
  
  // Extra meta data
  meta: { type: Schema.Types.Mixed },
  ...addTimeStamp(),
});


// ================= EXPORT =================
module.exports = model("Order", OrderSchema);
