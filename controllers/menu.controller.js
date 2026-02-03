const serviceMenu = require("../services/menu.service");
const CONSTANTS_MSG = require("../utils/constantsMessage");
const { SUCCESS, NOT_FOUND, SERVER_ERROR } = require("../utils/constants");
const { apiErrorRes, apiSuccessRes } = require("../utils/globalFunction");

const getAllMenu = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      sortBy = "",
      sortOrder = "",
    } = req.body;

    const filters = {};

    // 🔍 Search text
    if (search && search.trim() !== "") {
      filters.search = search.trim();
    }

    // 📂 Category
    if (category && category.trim() !== "") {
      filters.category = category.trim();
    }

    // 💰 Price range
    if (minPrice !== undefined && minPrice !== "") {
      filters.minPrice = Number(minPrice);
    }

    if (maxPrice !== undefined && maxPrice !== "") {
      filters.maxPrice = Number(maxPrice);
    }

    // 🔃 Sorting (only if provided)
    if (sortBy && sortBy.trim() !== "") {
      filters.sortBy = sortBy;
    }

    if (sortOrder && sortOrder.trim() !== "") {
      filters.sortOrder = sortOrder;
    }

    // const filters = Object.fromEntries(
    //   Object.entries({
    //     search,
    //     category,
    //     minPrice,
    //     maxPrice,
    //     sortBy,
    //     sortOrder,
    //   }).filter(([_, v]) => v !== undefined && v !== null && v !== ""),
    // );
    
    console.log("filters",filters);
    
    const menu = await serviceMenu.getAllMenu(filters);
    if (!menu.status || !menu.data.length) {
      return apiErrorRes(req, res, NOT_FOUND, CONSTANTS_MSG.MENU_NOT_FOUND);
    }
    return apiSuccessRes(
      req,
      res,
      SUCCESS,
      CONSTANTS_MSG.MENU_FETCHED,
      menu.data,
    );
  } catch (error) {
    console.error("Error fetching menu:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};

const getMenuById = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const menu = await serviceMenu.getMenuById(menuItemId);
    if (!menu.status) {
      return apiErrorRes(req, res, NOT_FOUND, CONSTANTS_MSG.MENU_NOT_FOUND);
    }
    return apiSuccessRes(
      req,
      res,
      SUCCESS,
      CONSTANTS_MSG.MENU_FETCHED,
      menu.data,
    );
  } catch (error) {
    console.error("Error fetching menu by ID:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};

module.exports = {
  getAllMenu,
  getMenuById,
};
