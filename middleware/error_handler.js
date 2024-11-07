const multer = require("multer");
const responseFormatter = require("../helpers/response_formatter");

module.exports = function errorHandler(err, req, res, next) {
  let message = [];
  let status_code = 500;

  // console.log(err);

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
      switch (err.message.toUpperCase()) {
        case "NOT FOUND":
          status_code = 404;
          message = "Data tidak dapat ditemukan!";
          break;

        case "NON OWNER":
          status_code = 403;
          message = "Data tersebut bukan milik Anda!";
          break;

        case "FORBIDDEN":
          status_code = 403;
          message = "Hak akses ditolak";
          break;

        case "AUTH FAILED":
          status_code = 401;
          message = "Autentikasi tidak valid!";
          break;

        case "INVALID TOKEN":
          status_code = 401;
          message = "Access Token tidak valid atau sudah kedaluarsa!";
          break;

        case "MAX FILE SIZE":
          status_code = 400;
          message = ["Ukuran file yang diunggah terlalu besar!"];
          break;

        case "INVALID FILETYPE":
          status_code = 400;
          message = ["Jenis file yang diunggah tidak valid!"];
          break;

        default:
          status_code = err.status || 500;
          message = err.message || "Unhandled Exception Error";
          break;
      }
  }
  return responseFormatter(res, status_code, message);
};
