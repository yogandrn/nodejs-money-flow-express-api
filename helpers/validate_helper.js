const fs = require("fs");
const moment = require("moment");

const { FileTypes } = require("../config/file_upload");

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

// const isValidFileType = (file) => {
//   const result = FileTypes[file.mimetype];
//   if (!result) {
//     fs.promises.unlink(`${image.destination}/${image.filename}`);
//     return false;
//   }
//   return true;
// };

const isValidFileSize = (file) => {
  const maxFileSize = 1024 * 1024 * 1; // 1MB
  if (file.size > maxFileSize) {
    fs.promises.unlink(`${file.destination}/${file.filename}`);
    return false;
  }
  return true;
};

module.exports = {
  isDateBeforeTommorow,
  isPasswordRegexValid,
  isValidFileSize,
};
