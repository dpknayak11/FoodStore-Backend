const Joi = require("joi");

// ================= COMMON FIELDS =================
const name = Joi.string().min(2).max(50);
const email = Joi.string().email();
const password = Joi.string().min(6);
const mobNo = Joi.string().pattern(/^[0-9]{10}$/);
const optionalString = Joi.string().allow("", null);
const objectId = Joi.string().hex().length(24);
const dob = Joi.date();
const array = Joi.array();

// ================= AUTH =================
exports.registerSchema = Joi.object({
  name: name.required(),
  email: email.required(),
  password: password.required(),
});

exports.loginSchema = Joi.object({
  email: email.required(),
  password: password.required(),
});

// ================= USERS =================

exports.updateUserSchema = Joi.object({
  name,
  email,
  password,
}).min(1); // kam se kam 1 field bhejni hogi

// ================= MENU ITEMS =================
exports.menuCreateSchema = Joi.object({
    name: name.required(),
    description: optionalString,
    price: Joi.number().min(0).required(),
    image: optionalString,
});

exports.menuGetSchema = Joi.object({
    menuItemId: objectId.required(),
});

exports.menuGetAllSchema = Joi.object({
    search: optionalString,
    category: optionalString,
    minPrice: Joi.number().min(0),
    maxPrice: Joi.number().min(0),
    sortBy: Joi.string().valid("name", "price", "createdAt"),
    sortOrder: Joi.string().valid("asc", "desc"),
});

// ================= CART =================
exports.addToCartSchema = Joi.object({
    menuItemId: objectId.required(),
    quantity: Joi.number().min(1).required(),
});
exports.updateCartSchema = Joi.object({
    menuItemId: objectId.required(),
    quantity: Joi.number().min(1).required(),
});
exports.removeFromCartSchema = Joi.object({
    menuItemId: objectId.required(),
});


