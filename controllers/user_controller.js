const responseFormatter = require("../helpers/response_formatter");

const userInfoHandler = async (req, res, next) => {
  try {
    console.log(req.user);
    return responseFormatter(res, 200, "Berhasil", req.user);
  } catch (error) {
    next(error);
  }
};

module.exports = { userInfoHandler };
