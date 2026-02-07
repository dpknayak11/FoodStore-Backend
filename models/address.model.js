const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const { addTimeStamp } = require("../utils/addTimeStamp");

const AddressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullAddress: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
    phone: { type: String, required: true },
    ...addTimeStamp(),
  }
);

module.exports = model("Address", AddressSchema);
