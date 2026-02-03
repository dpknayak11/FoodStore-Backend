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

server.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}! 🚀`);
});

// require('dotenv').config();
// const http = require('http');
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// // const morgan = require('morgan');
// const moment = require('moment-timezone');

// // Initialize DB connection (config/db.js handles connection on require)
// require('./config/db');

// const { apiErrorRes } = require('./utils/globalFunction');
// const MESSAGES = require('./utils/constantsMessage');
// const STATUS = require('./utils/constants');

// // Routes
// const userRoutes = require('./routes/user.routes');
// const menuRoutes = require('./routes/menu.routes');
// // const cartRoutes = require('./routes/cart.routes');
// // const orderRoutes = require('./routes/order.routes');

// // Middleware
// // const errorHandler = require('./middleware/error.middleware');

// const app = express();

// // Security & logging
// app.use(helmet());
// // app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// // CORS
// const corsConfig = {
//   origin: process.env.CORS_ORIGIN || '*',
//   optionsSuccessStatus: 200,
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
// };
// app.use(cors(corsConfig));
// app.options('*', cors(corsConfig));

// // Body parsers
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// // Basic root
// app.get('/', (req, res) => res.send('Your backend connected! dpknayak11'));

// // API mount point
// const API_V1 = process.env.API_END_POINT_V1 || '/api/v1';
// // app.use(`${API_V1}/auth`, userRoutes);
// // app.use(`${API_V1}/menu`, menuRoutes);
// // app.use(`${API_V1}/cart`, cartRoutes);
// // app.use(`${API_V1}/orders`, orderRoutes);

// // 404 handler
// app.use((req, res) => apiErrorRes(req, res, STATUS.NOT_FOUND, MESSAGES.NOT_FOUND, null));

// // Error handler (must be last)
// // app.use(errorHandler);

// const PORT = process.env.PORT || 3000;
// const server = http.createServer(app);

// // Log server start time in IST
// try {
//   const istTime = moment().tz('Asia/Kolkata').format('DD/MM/YYYY HH:mm:ss');
//   console.log('Start time (IST):', istTime);
// } catch (e) {
//   console.warn('Could not format IST time:', e.message);
// }

// server.listen(PORT, () => console.log(`Server is up and running on port ${PORT}! 🚀`));

// module.exports = server;
