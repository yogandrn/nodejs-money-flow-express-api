const jwt = require("jsonwebtoken");
const { User } = require("../models");
const responseFormatter = require("../helpers/response_formatter");

module.exports = async function authenticateToken(req, res, next) {
  try {
    // Mengambil token dari header Authorization
    const token = req.headers["authorization"]?.split(" ")[1];
    const secretKey = process.env.JWT_SECRET || "secret";

    if (!token)
      next(responseFormatter(res, 401, "Access Token tidak ditemukan!"));

    const decoded = jwt.verify(token, secretKey);

    // jika token tidak valid
    if (!decoded) {
      throw new Error("Invalid Token");
    }

    // cari user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      throw new Error("Not Found");
    }

    // jika access nya bukan ADMIN / ROOT
    if (user.access_role === "USER") {
      throw new Error("Forbidden");
    }

    const { id, email, access_role } = user;
    req.user = { id, email, access_role };

    next();
  } catch (error) {
    next(error);
  }
};
