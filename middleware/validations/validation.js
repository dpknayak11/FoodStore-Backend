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

// ================= ADDRESS =================
exports.addressCreateSchema = Joi.object({
  fullAddress: optionalString.required(),
  phone: optionalString.required(),
  isDefault: Joi.boolean().default(false),
});

exports.addressGetSchema = Joi.object({
  id: objectId.required(),
});

exports.addressUpdateSchema = Joi.object({
  id: objectId.required(),
  fullAddress: optionalString,
  phone: optionalString,
  isDefault: Joi.boolean(),
});

exports.addressDeleteSchema = Joi.object({
  id: objectId.required(),
});

// ================= ORDER =================

const price = Joi.number().min(0);
const quantity = Joi.number().min(1);

const orderStatus = Joi.string().valid(
  "received",
  "preparing",
  "out_for_delivery",
  "delivered",
  "cancelled",
);

// Order Item
const orderItemSchema = Joi.object({
  menuItem: objectId.required(),
  name: name.required(),
  price: price.required(),
  quantity: quantity.required(),
  notes: optionalString,
});

// Delivery Info
const deliveryInfoSchema = Joi.object({
  name: name.required(),
  phone: mobNo.required(),
  address: Joi.string().min(5).required(),
  notes: optionalString,
});

// Create Order
exports.orderCreateSchema = Joi.object({
  items: Joi.array().items(orderItemSchema).min(1).required(),
  deliveryInfo: deliveryInfoSchema.required(),
  subtotal: price.required(),
  deliveryFee: price.default(0),
  total: price.required(),
  meta: Joi.object().optional(),
});

// Get Single Order
exports.orderGetSchema = Joi.object({
  id: Joi.string().required(),
});

// uodate Order status
exports.orderStatusUpdateSchema = Joi.object({
  id: Joi.string().required(),
  status: orderStatus.required(),
});
