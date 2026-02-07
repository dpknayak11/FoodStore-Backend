const serviceAddress = require("../services/address.service");
const CONSTANTS_MSG = require("../utils/constantsMessage");
const { SUCCESS, NOT_FOUND, SERVER_ERROR } = require("../utils/constants");
const { apiErrorRes, apiSuccessRes } = require("../utils/globalFunction");

const getAllAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const address = await serviceAddress.getAllAddressByUserId({userId: userId});
    if (!address.status || !address.data.length) {
      return apiErrorRes(req, res, NOT_FOUND, CONSTANTS_MSG.ADDRESS_NOT_FOUND);
    }
    return apiSuccessRes(
      req,
      res,
      SUCCESS,
      CONSTANTS_MSG.ADDRESS_FETCHED,
      address.data,
    );
  } catch (error) {
    console.error("Error fetching address:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};

const getAddressById = async (req, res) => {
  try {
    const { id } = req.params;
    const address = await serviceAddress.getAddressById(id);
    if (!address.status) {
      return apiErrorRes(req, res, NOT_FOUND, CONSTANTS_MSG.ADDRESS_NOT_FOUND);
    }
    return apiSuccessRes(
      req,
      res,
      SUCCESS,
      CONSTANTS_MSG.ADDRESS_FETCHED,
      address.data,
    );
  } catch (error) {
    console.error("Error fetching address by ID:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};

const createAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const address = await serviceAddress.saveAddress({ ...req.body, userId: userId });
    if (!address.status) {
      return apiErrorRes(req, res, NOT_FOUND, CONSTANTS_MSG.ADDRESS_NOT_FOUND);
    }
    return apiSuccessRes(
      req,
      res,
      SUCCESS,
      CONSTANTS_MSG.ADDRESS_ADDED,
      address.data,
    );
  } catch (error) {
    console.error("Error creating address:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};

const updateAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id, fullAddress, phone, isDefault } = req.body;

    if (!id) {
      return apiErrorRes(req, res, BAD_REQUEST, CONSTANTS_MSG.ADDRESS_ID_REQUIRED);
    }

    // Agar default set ho raha hai → pehle dusre sab false
    if (isDefault === true) {
      await serviceAddress.updateManyAddress(
        { userId: userId, _id: { $ne: id } },
        { isDefault: false }
      );
    }

    const updatedAddress = await serviceAddress.updateAddressById(
      { _id: id, userId: userId },
      {
        ...(fullAddress && { fullAddress: fullAddress.trim() }),
        ...(phone && { phone: phone.trim() }),
        ...(typeof isDefault === "boolean" && { isDefault }),
      }
    );

    if (!updatedAddress.status) {
      return apiErrorRes(req, res, NOT_FOUND, CONSTANTS_MSG.ADDRESS_NOT_FOUND);
    }

    return apiSuccessRes(
      req,
      res,
      SUCCESS,
      CONSTANTS_MSG.ADDRESS_UPDATED,
      updatedAddress.data
    );

  } catch (error) {
    console.error("Error updating address:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};


const deleteAddress = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const address = await serviceAddress.deleteAddress({ _id: id, userId: userId });
    if (!address.status) {
      return apiErrorRes(req, res, NOT_FOUND, CONSTANTS_MSG.ADDRESS_NOT_FOUND);
    }
    return apiSuccessRes(
      req,
      res,
      SUCCESS,
      CONSTANTS_MSG.ADDRESS_DELETED
    );
  } catch (error) {
    console.error("Error deleting address:", error);
    return apiErrorRes(req, res, SERVER_ERROR, CONSTANTS_MSG.SERVER_ERROR);
  }
};


module.exports = {
  getAllAddress,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress
};
