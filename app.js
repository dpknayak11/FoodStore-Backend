require("dotenv").config();
const express = require("express");
const cors = require("cors");
const moment = require("moment-timezone");
const cron = require("node-cron");
const { apiSuccessRes, apiErrorRes } = require("./utils/globalFunction");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { PORT, API_END_POINT_V1 } = process.env;
const connectDB = require("./config/db");
app.use(cors());
// Routes
const userRoutes = require("./routes/user.routes");
const menuRoutes = require("./routes/menu.routes");
const addressRoutes = require("./routes/address.routes");
// const { default: mongoose } = require("./config/db");
const orderRoutes = require("./routes/order.routes");
// const orderModel = require("./models/order.model");
const corsConfig = {
  origin: "*",
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.options("", cors(corsConfig));
app.get("/", (req, res) => {
  res.send("Your backend conected! dpknayak11");
});

const istTime = moment().tz("Asia/Kolkata");
// Format the time in 24-hour format
const formattedTime = istTime.format("DD/MM/YYYY HH:mm:ss");
console.log(formattedTime);
connectDB()
// Basic root
app.get("/", (req, res) => res.send("Your backend connected! dpknayak11"));

// API mount point

app.use(`${API_END_POINT_V1}/auth`, userRoutes);
app.use(`${API_END_POINT_V1}/menu`, menuRoutes);
app.use(`${API_END_POINT_V1}/address`, addressRoutes);
app.use(`${API_END_POINT_V1}/order`, orderRoutes);

// ⏰ Runs every minute
// cron.schedule("* * * * *", async () => {
//   try {
//     const now = moment().tz("Asia/Kolkata");
//     console.log("🕒 Cron running at:", now.format("DD/MM/YYYY hh:mm A"));
//     const orders = await orderModel.find({
//       status: { $in: ["received", "preparing", "out_for_delivery"] },
//     });
//     let updatedCount = 0;
//     for (const order of orders) {
//       const orderTime = moment.tz(order.createdTime, "M/D/YYYY, h:mm A", "Asia/Kolkata");
//       const minutesPassed = now.diff(orderTime, "minutes");
//       let newStatus = order.status;
//       if (minutesPassed >= 15 && order.status !== "delivered") {
//         newStatus = "delivered";
//       } else if (minutesPassed >= 10 && order.status === "preparing") {
//         newStatus = "out_for_delivery";
//       } else if (minutesPassed >= 5 && order.status === "received") {
//         newStatus = "preparing";
//       }
//       if (newStatus !== order.status) {
//         order.status = newStatus;
//         await order.save();
//         updatedCount++;
//       }
//     }
//     console.log(`✅ Orders status updated: ${updatedCount}`);
//   } catch (error) {
//     console.error("❌ Cron error:", error.message);
//   }
// });

server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}! 🚀`);
});
