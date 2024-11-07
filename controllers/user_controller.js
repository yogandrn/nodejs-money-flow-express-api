const bcrypt = require("bcrypt");
const path = require("path");

const { User, sequelize } = require("../models");
const responseFormatter = require("../helpers/response_formatter");
const {
  isPasswordRegexValid,
  isValidFileSize,
} = require("../helpers/validate_helper");

const userInfoHandler = async (req, res, next) => {
  try {
    // find user
    let data = await User.findOne({
      where: { id: req.user.id },
    });

    if (!data) {
      throw new Error("Not Found");
    }

    return responseFormatter(res, 200, "Berhasil", data);
  } catch (error) {
    next(error);
  }
};

const updateProfileHandler = async (req, res, next) => {
  const { id, email } = req.user;
  const { name, phone_number } = req.body;

  try {
    // update user data dengan db transaction
    let result = await sequelize.transaction(async (transaction) => {
      let user = await User.findOne({
        where: { id },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!user) {
        throw new Error("Not Found");
      }

      user.name = name;
      user.phone_number = phone_number;
      await user.save({ transaction });

      return user;
    });

    return responseFormatter(
      res,
      200,
      "Berhasil memperbarui data profil.",
      result
    );
  } catch (error) {
    next(error);
  }
};

const uploadProfilePictureHandler = async (req, res, next) => {
  try {
    const image = req.file;

    // validate file exist
    if (!image) {
      return responseFormatter(res, 400, ["File image tidak boleh kosong!"]);
    }

    if (!isValidFileSize(image)) {
      return responseFormatter(res, 400, ["Ukuran file terlalu besar!"]);
    }

    // generate file path
    const pathName = `${req.protocol}://${req.get("host")}/${
      image.destination
    }/${image.filename}`;

    // update user photo with db transaction
    let result = await sequelize.transaction(async (transaction) => {
      let user = await User.findOne({
        where: { id: req.user.id },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!user) {
        throw new Error("Not found");
      }

      user.profile_picture = pathName;
      await user.save({ transaction });

      return user;
    });

    return responseFormatter(
      res,
      200,
      "Berhasil memperbarui foto profil pengguna.",
      result
    );
  } catch (error) {
    next(error);
  }
};

const changePasswordHandler = async (req, res, next) => {
  const { old_password, new_password } = req.body;

  // validate input
  if (!old_password) {
    return responseFormatter(res, 400, ["Password lama tidak boleh kosong!"]);
  }
  if (!new_password) {
    return responseFormatter(res, 400, ["Password baru tidak boleh kosong!"]);
  }

  // validate password format
  const isValidFormat = isPasswordRegexValid(new_password);
  if (!isValidFormat) {
    return responseFormatter(res, 400, [
      "Password baru minimal 8 karakter dengan kombinasi huruf besar, huruf kecil, dan angka!",
    ]);
  }

  try {
    // change password with db transaction
    await sequelize.transaction(async (transaction) => {
      // find user
      let user = await User.scope("withPassword").findOne({
        where: { id: req.user.id },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      // if not found
      if (!user) {
        throw new Error("Not Found");
      }

      // verify old password
      const isValidPassword = await bcrypt.compare(old_password, user.password);
      if (!isValidPassword) {
        throw new Error("Auth Failed");
      }

      const hashedPassword = await bcrypt.hash(new_password, 12);

      user.password = hashedPassword;
      await user.save({ transaction });
    });

    return responseFormatter(res, 200, "Password berhasil diperbarui.");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  userInfoHandler,
  updateProfileHandler,
  uploadProfilePictureHandler,
  changePasswordHandler,
};
