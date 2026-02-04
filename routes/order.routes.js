const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { isAuth } = require("../middleware/auth.middleware");

// Create order
router.post("/create", isAuth, orderController.createOrder);
// List user orders
router.post("/list", isAuth, orderController.getOrdersForUser);
// Get single order (must own)
router.get("/:id", isAuth, orderController.getOrderById);

module.exports = router;
