require("dotenv").config();
const mongoose = require("mongoose");
const { DB_STRING } = process.env;

mongoose
  .connect(DB_STRING)
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err));
  
module.exports = mongoose;

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
