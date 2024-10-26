const moment = require("moment");

const isDateBeforeTommorow = (value) => {
  const inputDate = moment(value).startOf("day");
  const tommorrow = moment().add(1, "days").startOf("day");
  return inputDate.isBefore(tommorrow);
};

module.exports = { isDateBeforeTommorow };
