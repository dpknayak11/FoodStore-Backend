const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// Create order
router.post('/create', authenticate, orderController.createOrder);
// List user orders
router.post('/list', authenticate, orderController.getOrdersForUser);
// Get single order (must own)
router.get('/:id', authenticate, orderController.getOrderById);

module.exports = router; 