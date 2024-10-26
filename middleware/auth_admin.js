const jwt = require("jsonwebtoken");
const responseFormatter = require("../helpers/response_formatter");

module.exports = function authenticateToken(req, res, next) {
  try {
    // Mengambil token dari header Authorization
    const token = req.headers["authorization"]?.split(" ")[1];
    const secretKey = process.env.JWT_SECRET || "secret";

    if (!token) return responseFormatter(res, 401, "Unauthenticated");

    const decoded = jwt.verify(token, secretKey);

    // jika token tidak valid
    if (!decoded) {
      return responseFormatter(res, 401, "Unauthenticated");
    }

    // jika access nya bukan ADMIN / ROOT
    if (decoded.access_role === "USER") {
      return responseFormatter(res, 403, "Access denied");
    }

    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
};
