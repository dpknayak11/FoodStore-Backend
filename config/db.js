// db.js - mongoose cluster setup
const mongoose = require('mongoose');
require('dotenv').config();
const DB_STRING = process.env.DB_STRING;

if (!DB_STRING) {
  throw new Error("DB_STRING not found in environment variables");
}

const connectDB = async () => {
  try {
    await mongoose.connect(DB_STRING, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log('MongoDB connected 🚀');
  } catch (err) {
    console.error('MongoDB error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

// require("dotenv").config();
// const mongoose = require("mongoose");
// const DB_STRING = process.env.DB_STRING;
// if (!DB_STRING) {
//   throw new Error("DB_STRING not found in env");
// }
// let cached = global.mongoose;
// if (!cached) {
//   cached = global.mongoose = { conn: null, promise: null };
// }
// async function connectDB() {
//   if (cached.conn) return cached.conn;

//   if (!cached.promise) {
//     cached.promise = mongoose.connect(DB_STRING, {
//       bufferCommands: false,
//     }).then((mongoose) => {
//       console.log("MongoDB Connected");
//       return mongoose;
//     });
//   }

//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// module.exports = connectDB;
