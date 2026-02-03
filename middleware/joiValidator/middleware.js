// Import custom error response function (standard error format bhejne ke liye)
const { apiErrorRes } = require("../../utils/globalFunction");

// Import HTTP status constant for bad request (validation fail case)
const { BAD_REQUEST } = require("../../utils/constants");

// Reusable Joi validation middleware factory
// schema = Joi schema object
// property = request ka part validate karna hai ("body", "query", "params")
const joiValidator = (schema, property = "body") => {
  // Return actual Express middleware function
  return async (req, res, next) => {
    try {
      // Get data from request based on property (body/query/params)
      const data = req[property];

      // Validate data against Joi schema
      await schema.validateAsync(data, {
        abortEarly: false, // Saare errors ek saath dikhaye, first error pe stop na ho
        stripUnknown: true, // Extra fields ko automatically remove kar de
      });

      // Agar validation pass ho gaya → next middleware/controller pe jao
      next();
    } catch (error) {
      // Agar validation fail hua → Joi error object milta hai

      // Errors ko field-wise map me convert kar rahe hain
      const errorMap = error.details.reduce((acc, detail) => {
        const fieldName = detail.path[0]; // Kaunsa field fail hua
        const errorMessage = detail.message.replace(/"/g, ""); // Clean message (quotes remove)
        acc[fieldName] = errorMessage; // { email: "email is required" }
        return acc;
      }, {});

      // Standard API error response bhej rahe hain
      return apiErrorRes(req, res, BAD_REQUEST, errorMap);
    }
  };
};

// Middleware ko export kar diya so routes me use ho sake
module.exports = joiValidator;
