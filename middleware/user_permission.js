const responseFormatter = require("../helpers/response_formatter");

module.exports = function (...roles) {
  return async (req, res, next) => {
    const accessRole = req.user.access_role;

    if (!roles.includes(accessRole)) {
      return next(
        responseFormatter(res, 403, "Anda tidak memiliki akses ke halaman ini!")
      );
    }

    next();
  };
};
