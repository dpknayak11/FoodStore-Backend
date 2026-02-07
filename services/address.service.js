const Address = require("../models/address.model");
const { resultDb } = require("../utils/globalFunction");
const { DATA_NULL } = require("../utils/constants");

const getAddressById = async (query) => {
  try {
    const user = await Address.findById(query).lean();
    return user ? resultDb(true, user) : resultDb(false, DATA_NULL);
  } catch (err) {
    console.error("address.getAddressById error:", err);
    return resultDb(false, DATA_NULL);
  }
};

// Save Address
const saveAddress = async (data) => {
  try {
    const resData = new Address(data);
    await resData.save();
    return resultDb(true, resData);
  } catch (error) {
    console.error("Error in saveAddress:", error);
    return resultDb(false, DATA_NULL);
  }
};

// Get All Addresss by User ID
const getAllAddressByUserId = async (query) => {
  try {
    // const resData = await Address.find(query).lean();
    const resData = await Address.find(query)
      .sort({ isDefault: -1, createdAt: -1 }) // default first, newest after
      .lean();
    return resData.length > 0
      ? resultDb(true, resData)
      : resultDb(false, DATA_NULL);
  } catch (error) {
    console.error("Error in getAllAddresssByUserId:", error);
    return resultDb(false, DATA_NULL);
  }
};

// Delete Address
const deleteAddress = async (query) => {
  try {
    const resData = await Address.deleteOne(query);
    return resData.deletedCount === 0
      ? resultDb(false, DATA_NULL)
      : resultDb(true);
  } catch (error) {
    console.error("Error in deleteAddress:", error);
    return resultDb(false, DATA_NULL);
  }
};

const updateManyAddress = async (query, data) => {
  try {
    const resData = await Address.updateMany(query, data);
    return resData.modifiedCount >= 0
      ? resultDb(true, resData)
      : resultDb(false, DATA_NULL);
  } catch (error) {
    console.error("Error in updateManyAddress:", error);
    return resultDb(false, DATA_NULL);
  }
};

const updateAddressById = async (query, data) => {
  try {
    const resData = await Address.findOneAndUpdate(query, data, { new: true });
    return resData ? resultDb(true, resData) : resultDb(false, DATA_NULL);
  } catch (error) {
    console.error("Error in updateAddressById:", error);
    return resultDb(false, DATA_NULL);
  }
};

module.exports = {
  saveAddress,
  getAddressById,
  getAllAddressByUserId,
  deleteAddress,
  updateManyAddress,
  updateAddressById,
};
