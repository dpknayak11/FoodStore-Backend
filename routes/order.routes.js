const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { isAuth } = require("../middleware/auth.middleware");
const schema = require("../middleware/validations/validation");
const joiValidator = require("../middleware/joiValidator/middleware");

// Create order
router.post(
  "/create",
  isAuth,
  joiValidator(schema.orderCreateSchema, "body"),
  orderController.createOrder,
);
// List user All orders
router.get("/", isAuth, orderController.getAllOrder);

router.post(
  "/updatestatus",
  isAuth,
  joiValidator(schema.orderStatusUpdateSchema, "body"),
  orderController.updateOrderStatus,
);

module.exports = router;