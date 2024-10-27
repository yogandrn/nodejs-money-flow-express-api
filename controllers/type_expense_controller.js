const responseFormatter = require("../helpers/response_formatter");
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
  const { name, thumbnail, description } = req.body;

  // db transaction
  const transaction = await sequelize.transaction();

  try {
    const newData = await TypeOfExpense.create(
      { name, thumbnail, description },
      { transaction }
    );

    // db commit
    await transaction.commit();

    return responseFormatter(
      res,
      201,
      "Berhasil menambahkan jenis pengeluaran baru.",
      newData
    );
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const updateTypeExpenseHandler = async (req, res, next) => {
  const { id } = req.params;
  const { name, description, thumbnail } = req.body;

  // db transaction
  const transaction = await sequelize.transaction();

  try {
    // cari data yg di-update
    const data = await TypeOfExpense.findOne({
      where: { id },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!data) {
      await transaction.rollback();
      return responseFormatter(
        res,
        404,
        "Data jenis pengeluaran tidak dapat ditemukan!"
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
      "Berhasil memperbarui data jenis pengeluaran.",
      data
    );
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const deleteTypeExpenseHandler = async (req, res, next) => {
  const { id } = req.params;

  // db transaction
  const transaction = await sequelize.transaction();

  try {
    // cari data yg dihapus
    const data = await TypeOfExpense.findOne({
      where: { id },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!data) {
      await transaction.rollback();
      return responseFormatter(
        res,
        404,
        "Data jenis pengeluaran tidak dapat ditemukan!"
      );
    }

    await TypeOfExpense.destroy({ where: { id }, transaction });

    // db commit
    await transaction.commit();

    return responseFormatter(
      res,
      200,
      "Berhasil menghapus data jenis pengeluaran."
    );
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

module.exports = {
  getTypeExpenseListHandler,
  createTypeExpenseHandler,
  updateTypeExpenseHandler,
  deleteTypeExpenseHandler,
};
