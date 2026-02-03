const express = require('express');
const router = express.Router();
const authController = require('../controllers/user.controller');
const { isAuth } = require('../middleware/auth.middleware');
const joiValidator = require("../middleware/joiValidator/middleware");
const schema = require("../middleware/validations/validation");

// GET /api/auth/me
router.get('/profile', isAuth, authController.getProfile);
router.post("/register", joiValidator(schema.registerSchema,'body'), authController.register);
router.post("/login", joiValidator(schema.loginSchema,'body'), authController.login);

module.exports = router;
