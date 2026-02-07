require("dotenv").config();
const express = require("express");
const cors = require("cors");
const moment = require("moment-timezone");
const CONSTANTS_MSG = require("./utils/constantsMessage");
const { apiSuccessRes, apiErrorRes } = require("./utils/globalFunction");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { PORT, API_END_POINT_V1 } = process.env;
app.use(cors());
// Routes
const userRoutes = require("./routes/user.routes");
const menuRoutes = require("./routes/menu.routes");
const addressRoutes = require("./routes/address.routes");
const { default: mongoose } = require("./config/db");
// const orderRoutes = require('./routes/order.routes');

const corsConfig = {
  origin: "*",
  optionsSuccessStatus: 200,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
};

// Body parsers
// mongoose()
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

// Basic root
app.get("/", (req, res) => res.send("Your backend connected! dpknayak11"));

// API mount point
const API_V1 = process.env.API_END_POINT_V1 || "/api/v1";
app.use(`${API_V1}/auth`, userRoutes);
app.use(`${API_V1}/menu`, menuRoutes);
app.use(`${API_V1}/address`, addressRoutes);

server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}! 🚀`);
});