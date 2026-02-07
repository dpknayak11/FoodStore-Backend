const express = require("express");
const router = express.Router();
const addressController = require("../controllers/address.controller");
const { isAuth } = require("../middleware/auth.middleware");
const schema = require("../middleware/validations/validation");
const joiValidator = require("../middleware/joiValidator/middleware");

// POST /api/address
router.post(
  "/create",
  joiValidator(schema.addressCreateSchema, "body"),
  isAuth,
  addressController.createAddress,
);
// GET /api/address/:id
router.get(
  "/:id",
  joiValidator(schema.addressGetSchema, "params"),
  isAuth,
  addressController.getAddressById,
);

// GET All /api/address
router.get(
  "/",
  isAuth,
  addressController.getAllAddress,
);
// DELETE /api/address/:id
router.delete(
  "/:id",
  joiValidator(schema.addressDeleteSchema, "params"),
  isAuth,
  addressController.deleteAddress,
);
// POST /api/address
router.post(
  "/update",
  joiValidator(schema.addressUpdateSchema, "body"),
  isAuth,
  addressController.updateAddress,
);


module.exports = router;
