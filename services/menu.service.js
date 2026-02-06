const Menu = require("../models/menu.model");
const { resultDb } = require("../utils/globalFunction");
const { DATA_NULL } = require("../utils/constants");

// const saveMenu = async (data) => {
//   try {
//     const resData = new Menu(data);
//     await resData.save();
//     return resultDb(true, resData);
//   } catch (error) {
//     console.error("Error in saveMenu:", error);
//     return resultDb(false, DATA_NULL);
//   }
// };

const getMenuById = async (query) => {
  try {
    const item = await Menu.findById(query).lean();
    return item ? resultDb(true, item) : resultDb(false, null);
  } catch (err) {
    console.error("menu.getMenuById error:", err);
    return resultDb(false, DATA_NULL);
  }
};

const getAllMenu = async () => {
  try {
    const resData = await Menu.find().lean();
    return resData.length > 0
      ? resultDb(true, resData)
      : resultDb(false, DATA_NULL);
  } catch (err) {
    console.error("menu.getAllMenu error:", err);
    return resultDb(false, DATA_NULL);
  }
};

module.exports = {
//   saveMenu,
  getAllMenu,
  getMenuById,
};
