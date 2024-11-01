const responseFormatter = require("../helpers/response_formatter");
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
  const { name, thumbnail, description } = req.body;

  let transaction;

  try {
    // db transaction
    transaction = await sequelize.transaction();

    // create new data
    const newData = await TypeOfIncome.create(
      { name, thumbnail, description },
      { transaction }
    );

    // db commit
    await transaction.commit();

    return responseFormatter(
      res,
      201,
      "Berhasil menambahkan jenis pemasukan baru.",
      newData
    );
  } catch (error) {
    if (transaction) await transaction.rollback();
    next(error);
  }
};

const updateTypeIncomeHandler = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, thumbnail } = req.body;

  let transaction;

  try {
    // db transaction
    transaction = await sequelize.transaction();

    // cari data yg di-update
    const data = await TypeOfIncome.findOne({
      where: { id },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!data) {
      await transaction.rollback();
      return responseFormatter(
        res,
        404,
        "Data jenis pemasukan tidak dapat ditemukan!"
      );
    }

    // update data
    data.name = name;
    data.thumbnail = thumbnail;
    data.description = description;
    await data.save({ transaction });

    // db commit
    await transaction.commit();

    return responseFormatter(
      res,
      200,
      "Berhasil memperbarui data jenis pemasukan.",
      data
    );
  } catch (error) {
    if (transaction) await transaction.rollback();
    next(error);
  }
};

const deleteTypeIncomeHandler = async (req, res, next) => {
  const { id } = req.params;

  let transaction;

  try {
    // db transaction
    transaction = await sequelize.transaction();

    // cari data yg dihapus
    const data = await TypeOfIncome.findOne({
      where: { id },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!data) {
      await transaction.rollback();
      return responseFormatter(
        res,
        404,
        "Data jenis pemasukan tidak dapat ditemukan!"
      );
    }

    await TypeOfIncome.destroy({ where: { id }, transaction });

    // db commit
    await transaction.commit();

    return responseFormatter(
      res,
      200,
      "Berhasil menghapus data jenis pemasukan."
    );
  } catch (error) {
    if (transaction) await transaction.rollback();
    next(error);
  }
};

module.exports = {
  getTypeIncomeListHandler,
  createTypeIncomeHandler,
  updateTypeIncomeHandler,
  deleteTypeIncomeHandler,
};
