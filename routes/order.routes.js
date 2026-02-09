const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { isAuth } = require("../middleware/auth.middleware");

// Create order
router.post(
  "/create",
  isAuth,
  joiValidator(schema.orderCreateSchema, "body"),
  orderController.createOrder,
);
// List user All orders
router.post("/", isAuth, orderController.getOrdersForUser);
// Get single order (must own)
router.post(
  "/cancle/:id",
  isAuth,
  joiValidator(schema.orderCancleSchema, "params"),
  orderController.cancleOrder,
);

module.exports = router;