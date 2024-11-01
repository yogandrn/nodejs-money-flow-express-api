const moment = require("moment");

const isDateBeforeTommorow = (value) => {
  const inputDate = moment(value).startOf("day");
  const tommorrow = moment().add(1, "days").startOf("day");
  return inputDate.isBefore(tommorrow);
};

const isPasswordRegexValid = (value) => {
  // validate password format
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*\-_.]{8,255}$/;
  return regex.test(value);
};

module.exports = { isDateBeforeTommorow, isPasswordRegexValid };
