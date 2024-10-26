const responseFormatter = require("../helpers/response_formatter");

module.exports = function errorHandler(err, req, res, next) {
  let message = [];
  let status_code = 500;

  switch (err.name) {
    case "SequelizeValidationError":
      status_code = 400;
      message = err.errors.map((e) => e.message);
      break;

    case "SequelizeUniqueConstraintError":
      status_code = 409;
      message = err.errors.map((e) => e.message);
      break;

    default:
      status_code = err.status || 500;
      message = err.message || "Unhandled Exception Error";
      break;
  }
  return responseFormatter(res, status_code, message);
};
