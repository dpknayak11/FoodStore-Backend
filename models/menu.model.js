const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { addTimeStamp } = require("../utils/addTimeStamp");

const MenuItemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true, min: 0 },
    image: { type: String },
    category: { type: String, default: "general" },
    ...addTimeStamp(),
  }
);

module.exports = model("MenuItem", MenuItemSchema);
