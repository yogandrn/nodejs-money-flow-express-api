const bcrypt = require("bcrypt");

const { User, sequelize } = require("../models");
const responseFormatter = require("../helpers/response_formatter");

const userInfoHandler = async (req, res, next) => {
  try {
    const data = await User.findOne({ where: { id: req.user.id } });
    return responseFormatter(res, 200, "Berhasil", data);
  } catch (error) {
    next(error);
  }
};

const updateProfileHandler = async (req, res, next) => {
  const { id, email } = req.user;
  const { name, phone_number } = req.body;

  // db transaction
  const transaction = await sequelize.transaction();
  try {
    await User.update({ name, phone_number }, { where: { id }, transaction });

    // db commit
    await transaction.commit();

    let user = await User.findByPk(id);

    return responseFormatter(
      res,
      200,
      "Berhasil memperbarui data profil.",
      user
    );
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const changePasswordHandler = async (req, res, next) => {
  const { old_password, new_password } = req.body;

  if (!old_password) {
    return responseFormatter(res, 400, ["Password lama tidak boleh kosong!"]);
  }

  if (!new_password) {
    return responseFormatter(res, 400, ["Password baru tidak boleh kosong!"]);
  }

  // db transaction
  const transaction = await sequelize.transaction();

  try {
    let user = await User.findByPk(req.user.id);

    // verify old password
    const isValidPassword = await bcrypt.compare(old_password, user.password);
    if (!isValidPassword) {
      await transaction.rollback();
      return responseFormatter(res, 401, "Autentikasi gagal!");
    }

    // check format password
    const isValidFormat = User.isPasswordRegexValid(new_password);
    if (!isValidFormat) {
      await transaction.rollback();
      return responseFormatter(res, 400, [
        "Password harus mengandung kombinasi huruf besar, huruf kecil, dan angka!",
      ]);
    }

    const hashedPassword = await bcrypt.hash(new_password, 12);

    user.password = hashedPassword;
    await user.save({ transaction });

    await transaction.commit();
    return responseFormatter(res, 200, "Password berhasil diperbarui.");
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

module.exports = {
  userInfoHandler,
  updateProfileHandler,
  changePasswordHandler,
};
