const { User, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const responseFormatter = require("../helpers/response_formatter");
const { isPasswordRegexValid } = require("../helpers/validate_halper");

const registerHandler = async (req, res, next) => {
  const { name, email, phone_number, password } = req.body;

  try {
    // check password format
    const isValidFormat = isPasswordRegexValid(password);
    if (!isValidFormat) {
      return responseFormatter(res, 400, [
        "Password minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, dan angka!",
      ]);
    }

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 12);

    // insert data dengan db transaction
    let newUser = await sequelize.transaction(async (transaction) => {
      return await User.create(
        {
          name,
          email,
          phone_number,
          password: hashedPassword,
        },
        { transaction }
      );
    });

    // hide password on response
    newUser.password = null;

    return responseFormatter(res, 201, "Berhasil registrasi.", newUser);
  } catch (error) {
    next(error);
  }
};

const loginHandler = async (req, res, next) => {
  try {
    let user = await sequelize.transaction(async (transaction) => {
      // find user
      const userData = await User.scope("withPassword").findOne({
        where: { email: req.body.email },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      // jika user not found
      if (!userData) {
        return responseFormatter(res, 401, `Email atau password tidak sesuai!`);
      }

      // verify password
      const isVerified = await bcrypt.compare(
        req.body.password,
        userData.password
      );

      // jika password tidak sesuai
      if (!isVerified) {
        return responseFormatter(res, 401, `Email atau password tidak sesuai!`);
      }

      return userData;
    });

    const { id, email, access_role } = user;
    const token = await User.generateToken({ id, email, access_role });

    // hide user password on response
    user.password = null;

    const data = { user, token };

    return responseFormatter(res, 200, "Berhasil login", data);
  } catch (error) {
    next(error);
  }
};

module.exports = { registerHandler, loginHandler };
