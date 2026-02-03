const User = require("../models/user.model");
const { resultDb } = require("../utils/globalFunction");
const { DATA_NULL} = require("../utils/constants");

let saveUser = async (data) => {
  try {
    let resData = new User(data);
    let res = await resData.save();
    console.log("Saved user data:", res);
    return resultDb(true, res);
  } catch (error) {
    console.log("there are the catch error", error);
    if (error.code) return resultDb(false, DATA_NULL);
    return resultDb(false, DATA_NULL);
  }
};

const getUserByOne = async (query) => {
  try {
    const resData = await User.findOne(query);
    return resData
      ? resultDb(true, resData)
      : resultDb(false, DATA_NULL);
  } catch (error) {
    console.error("Error retrieving resData:", error);
    return resultDb(false, DATA_NULL);
  }
};

const getUserById = async (id) => {
  try {
    const resData = await User.findById({ _id: id }).lean();
    return resData 
    ? resultDb(true, resData) 
    : resultDb(false, DATA_NULL);
  } catch (err) {
    console.error("user.getUserById error:", err);
    return resultDb(false, DATA_NULL);
  }
};

module.exports = {
  saveUser,
  getUserByOne,
  getUserById,
};
