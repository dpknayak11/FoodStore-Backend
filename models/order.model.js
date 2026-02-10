const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { addTimeStamp } = require("../utils/addTimeStamp");

const OrderItemSchema = new Schema(
  {
    menuItem: { type: Schema.Types.ObjectId, ref: "MenuItem" },
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
    notes: { type: String },
  },
  { _id: false },
);

const DeliveryInfoSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    notes: { type: String },
  },
  { _id: false },
);

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  items: { type: [OrderItemSchema], required: true, default: [] },
  deliveryInfo: { type: DeliveryInfoSchema, required: true },
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, default: 0 },
  total: { type: Number, required: true, min: 0 },
  status: {
    type: String,
    enum: [
      "received",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ],
    default: "received",
  },
  createdTime: {
    type: String,
    default: () =>
      new Date().toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }),
  },
  meta: { type: Schema.Types.Mixed },
  ...addTimeStamp(),
});

module.exports = model("Order", OrderSchema);
