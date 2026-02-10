const orderService = require("../services/order.service");
const serviceMenu = require("../services/menu.service");
const serviceAddress = require("../services/address.service");

const { apiSuccessRes, apiErrorRes } = require("../utils/globalFunction");
const CONSTANTS_MSG = require("../utils/constantsMessage");

const {
  SUCCESS,
  CREATED,
  NOT_FOUND,
  SERVER_ERROR,
  BAD_REQUEST,
} = require("../utils/constants");

const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, deliveryInfo, subtotal, deliveryFee, total, meta } = req.body;
    if (!items?.length || !deliveryInfo) {
      return apiErrorRes(req, res, BAD_REQUEST, "Items and delivery info required");
    }
    const orderPayload = {
      userId,
      items,
      deliveryInfo,
      subtotal,
      deliveryFee,
      total,
      status: "received",
      meta: meta || {},
    };
    const order = await orderService.saveOrder(orderPayload);
    if (!order.status) {
      return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.ORDER_CREATED);
    }
    return apiSuccessRes(
      req,
      res,
      CREATED,
      CONSTANTS_MSG.ORDER_PLACED,
      order.data
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};

// const createOrder = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { items, deliveryInfo, subtotal, deliveryFee, total, meta } = req.body;

//     if (!items?.length || !deliveryInfo) {
//       return apiErrorRes(req, res, BAD_REQUEST, "Items and delivery info required");
//     }

//     let calculatedSubtotal = 0;
//     const verifiedItems = [];

//     // 🔍 Re-verify menu prices from DB
//     for (const item of items) {
//       const menuRes = await serviceMenu.getMenuById({ _id: item.menuItem });
//       if (!menuRes.status) {
//         return apiErrorRes(req, res, NOT_FOUND, CONSTANTS_MSG.MENU_NOT_FOUND);
//       }

//       const dbItem = menuRes.data;
//       const itemTotal = dbItem.price * item.quantity;
//       calculatedSubtotal += itemTotal;

//       verifiedItems.push({
//         menuItem: dbItem._id,
//         name: dbItem.name,
//         price: dbItem.price,
//         quantity: item.quantity,
//         notes: item.notes || "",
//       });
//     }

//     // 🚚 Delivery fee logic (recalculate)
//     const calculatedDeliveryFee = calculatedSubtotal > 500 ? 0 : 40;
//     const calculatedTotal = calculatedSubtotal + calculatedDeliveryFee;

//     // ❌ If frontend totals mismatch → reject
//     if (
//       calculatedSubtotal !== subtotal ||
//       calculatedDeliveryFee !== deliveryFee ||
//       calculatedTotal !== total
//     ) {
//       return apiErrorRes(req, res, BAD_REQUEST, "Price mismatch detected");
//     }

//     // 📦 Prepare order payload
//     const orderPayload = {
//       orderId: `ORD-${Date.now()}`,
//       userId,
//       items: verifiedItems,
//       deliveryInfo,
//       subtotal: calculatedSubtotal,
//       deliveryFee: calculatedDeliveryFee,
//       total: calculatedTotal,
//       status: "received",
//       meta: meta || {},
//     };

//     const order = await orderService.saveOrder(orderPayload);

//     if (!order.status) {
//       return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.ORDER_NOT_CREATED);
//     }

//     return apiSuccessRes(
//       req,
//       res,
//       CREATED,
//       CONSTANTS_MSG.ORDER_CREATED,
//       order.data
//     );

//   } catch (error) {
//     console.error("Error creating order:", error);
//     return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
//   }
// };


const getAllOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const order = await orderService.getAllOrder({ userId: userId });
    if (!order.status || !order.data.length) {
      return apiErrorRes(req, res, NOT_FOUND, CONSTANTS_MSG.ORDER_NOT_FOUND);
    }
    return apiSuccessRes(
      req,
      res,
      SUCCESS,
      CONSTANTS_MSG.ORDER_FETCHED,
      order.data,
    );
  } catch (error) {
    console.error("Error fetching order:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id, status } = req.body;
    const result = await orderService.updateOrderStatus({
      userId: req.user._id,
      _id: id,
      status,
    });

    if (!result.status) {
      return apiErrorRes(
        req,
        res,
        NOT_FOUND,
        CONSTANTS_MSG.ORDER_NOT_FOUND
      );
    }

    return apiSuccessRes(
      req,
      res,
      SUCCESS,
      CONSTANTS_MSG.ORDER_STATUS_UPDATED,
      result.data
    );

  } catch (error) {
    console.error("Error updating order status:", error);
    return apiErrorRes(
      req,
      res,
      SERVER_ERROR,
      CONSTANTS_MSG.SERVER_ERROR
    );
  }
};


module.exports = {
  createOrder,
  getAllOrder,
  updateOrderStatus,
};
