const fs = require("fs");

const responseFormatter = require("../helpers/response_formatter");
const { isValidFileSize } = require("../helpers/validate_helper");
const { TypeOfExpense, sequelize } = require("../models");

const getTypeExpenseListHandler = async (req, res, next) => {
  try {
    const data = await TypeOfExpense.findAll();

    return responseFormatter(
      res,
      200,
      "Berhasil mendapatkan data tipe pengeluaran.",
      data
    );
  } catch (error) {
    next(error);
  }
};

const createTypeExpenseHandler = async (req, res, next) => {
  const { name, description } = req.body;
  const image = req.file;

  // validate file exist
  if (!image) {
    return responseFormatter(res, 400, ["File image tidak boleh kosong!"]);
  }

  // validate file size
  if (!isValidFileSize(image)) {
    throw new Error("Max File Size");
  }

  // generate file path
  const pathName = `${req.protocol}://${req.get("host")}/${image.destination}/${
    image.filename
  }`;

  try {
    // create new data with db transaction
    const newData = await sequelize.transaction(async (transaction) => {
      return await TypeOfExpense.create(
        { name, description, thumbnail: pathName },
        { transaction }
      );
    });

    return responseFormatter(
      res,
      201,
      "Berhasil menambahkan jenis pengeluaran baru.",
      newData
    );
  } catch (error) {
    next(error);
  }
};

const updateTypeExpenseHandler = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    // update data with db transaction
    const result = await sequelize.transaction(async (transaction) => {
      // cari data yg di-update
      const data = await TypeOfExpense.findOne({
        where: { id },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!data) {
        throw new Error("Not found");
      }

      // jika ada file yang di unggah
      if (req.file) {
        const image = req.file;
        // validate file size
        if (!isValidFileSize(image)) {
          throw new Error("Max File Size");
        }

        // generate file path
        const pathName = `${req.protocol}://${req.get("host")}/${
          image.destination
        }/${image.filename}`;

        // delete old file
        const fileName = data.thumbnail.split("/").pop();
        const fileToDelete = `${process.env.FILESYSTEM_DISK}/${fileName}`;
        fs.promises.unlink(`${fileToDelete}`);

        // change file path
        data.thumbnail = pathName;
      }

      data.name = name || data.name;
      data.description = description || data.description;

      // save changes
      await data.save({ transaction });

      return data;
    });

    return responseFormatter(
      res,
      200,
      "Berhasil memperbarui data jenis pengeluaran.",
      result
    );
  } catch (error) {
    next(error);
  }
};

const deleteTypeExpenseHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    // delete data with db transaction
    await sequelize.transaction(async (transaction) => {
      // find data to delete
      const data = await TypeOfExpense.findOne({
        where: { id },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!data) {
        throw new Error("Not found");
      }

      // delete file thumbnail
      if (data.thumbnail !== null) {
        const fileName = data.thumbnail.split("/").pop();
        const fileToDelete = `${process.env.FILESYSTEM_DISK}/${fileName}`;
        fs.promises.unlink(`${fileToDelete}`);
      }

      await TypeOfExpense.destroy({ where: { id }, transaction });
    });

    return responseFormatter(
      res,
      200,
      "Berhasil menghapus data jenis pengeluaran."
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTypeExpenseListHandler,
  createTypeExpenseHandler,
  updateTypeExpenseHandler,
  deleteTypeExpenseHandler,
};
