const moment = require("moment-timezone");

function addTimeStamp() {
  return {
    isDisable: {
      type: Boolean,
      default: false,
    },
    date: {
      type: Number,
      default: () => moment().tz("Asia/Kolkata").startOf("day").valueOf(),
    },
    month: {
      type: Number,
      default: () => moment().tz("Asia/Kolkata").startOf("month").valueOf(),
    },
    year: {
      type: Number,
      default: () => moment().tz("Asia/Kolkata").startOf("year").valueOf(),
    },
    createdAt: {
      type: Number,
      default: () => moment().tz("Asia/Kolkata").valueOf(),
    },

    // 🕒 Human readable time (no seconds)
    createdTime: {
      type: String,
      default: () =>
        moment()
          .tz("Asia/Kolkata")
          .format("M/D/YYYY, h:mm A"),
    },
  };
}

module.exports = {
  addTimeStamp
};
