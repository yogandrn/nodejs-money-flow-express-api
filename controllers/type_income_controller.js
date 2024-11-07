const fs = require("fs");

const responseFormatter = require("../helpers/response_formatter");
const { isValidFileSize } = require("../helpers/validate_helper");
const { TypeOfIncome, sequelize } = require("../models");

const getTypeIncomeListHandler = async (req, res, next) => {
  try {
    const data = await TypeOfIncome.findAll();

    return responseFormatter(
      res,
      200,
      "Berhasil mendapatkan data tipe pemasukan.",
      data
    );
  } catch (error) {
    next(error);
  }
};

const createTypeIncomeHandler = async (req, res, next) => {
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
      return await TypeOfIncome.create(
        { name, description, thumbnail: pathName },
        { transaction }
      );
    });

    return responseFormatter(
      res,
      201,
      "Berhasil menambahkan jenis pemasukan baru.",
      newData
    );
  } catch (error) {
    next(error);
  }
};

const updateTypeIncomeHandler = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  try {
    // update data with db transaction
    const result = await sequelize.transaction(async (transaction) => {
      // cari data yg di-update
      let data = await TypeOfIncome.findOne({
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
        const fileToDelete = `${process.env.FILESYSTEM_DISK}/${data.thumbnail
          .split("/")
          .pop()}`;
        fs.promises.unlink(`${fileToDelete}`);

        // change file path
        data.thumbnail = pathName;
      }

      data.name = name || data.name;
      data.description = description || data.description;

      // save data changes
      await data.save({ transaction });

      return data;
    });

    return responseFormatter(
      res,
      200,
      "Berhasil memperbarui data jenis pemasukan.",
      result
    );
  } catch (error) {
    next(error);
  }
};

const deleteTypeIncomeHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    // delete data with db transaction
    await sequelize.transaction(async (transaction) => {
      // find data to delete
      const data = await TypeOfIncome.findOne({
        where: { id },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!data) {
        throw new Error("Not found");
      }

      // delete file thumbnail
      if (data.thumbnail !== null) {
        const fileToDelete = `${process.env.FILESYSTEM_DISK}/${data.thumbnail
          .split("/")
          .pop()}`;
        fs.promises.unlink(`${fileToDelete}`);
      }

      await TypeOfIncome.destroy({ where: { id }, transaction });
    });

    return responseFormatter(
      res,
      200,
      "Berhasil menghapus data jenis pemasukan."
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTypeIncomeListHandler,
  createTypeIncomeHandler,
  updateTypeIncomeHandler,
  deleteTypeIncomeHandler,
};
