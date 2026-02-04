const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menu.controller");
const { isAuth } = require("../middleware/auth.middleware");
const schema = require("../middleware/validations/validation");
const joiValidator = require("../middleware/joiValidator/middleware");

// POST /api/menu
router.post(
  "/",
  joiValidator(schema.menuGetAllSchema, "body"),
  menuController.getAllMenu,
);
// GET /api/menu/:id
router.get(
  "/:id",
  joiValidator(schema.menuGetSchema, "params"),
  menuController.getMenuById,
);

module.exports = router;
