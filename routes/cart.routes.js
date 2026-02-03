const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate } = require('../middleware/auth.middleware');

// GET cart
router.get('/', authenticate, cartController.getCart);
// POST Save 
router.post('/save', authenticate, cartController.addItem);
// POST update quantity
router.post('/update', authenticate, cartController.updateQuantity);
// DELETE remove item
router.delete('/:itemId', authenticate, cartController.removeItem);
// POST clear cart
router.post('/clear', authenticate, cartController.clearCart);

module.exports = router; 