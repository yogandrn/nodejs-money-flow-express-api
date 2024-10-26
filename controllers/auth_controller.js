const { User, sequelize } = require("../models");
const bcrypt = require("bcrypt");
const responseFormatter = require("../helpers/response_formatter");

const registerHandler = async (req, res, next) => {
  const { name, email, phone_number, password } = req.body;

  // begin db transaction
  const transaction = await sequelize.transaction();

  try {
    // check password format
    const isValidFormat = User.isPasswordRegexValid(password);
    if (!isValidFormat) {
      await transaction.rollback();
      return responseFormatter(res, 400, [
        "Password harus mengandung kombinasi huruf besar, huruf kecil, dan angka!",
      ]);
    }

    // encrypt password
    const hashedPassword = await bcrypt.hash(password, 12);

    // insert data
    const newUser = await User.create(
      {
        name,
        email,
        phone_number,
        password: hashedPassword,
      },
      { transaction }
    );

    await transaction.commit();

    return responseFormatter(res, 201, "Berhasil registrasi.", newUser);
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const loginHandler = async (req, res, next) => {
  try {
    // find user
    const user = await User.findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      return responseFormatter(res, 401, `Email atau password tidak sesuai!`);
    }

    // verify password
    const isValidPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isValidPassword) {
      return responseFormatter(res, 401, `Email atau password tidak sesuai!`);
    }

    const { id, email, access_role } = user;
    const token = await User.generateToken({ id, email, access_role });

    const data = { user, token };

    return responseFormatter(res, 200, "Berhasil login", data);
  } catch (error) {
    next(error);
  }
};

module.exports = { registerHandler, loginHandler };
