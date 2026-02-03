require("dotenv").config();
const mongoose = require("mongoose");
const { DB_STRING } = process.env;

mongoose
  .connect(DB_STRING)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));
  
module.exports = mongoose;
