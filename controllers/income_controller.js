const { Op, where } = require("sequelize");
const moment = require("moment");

const { Income, TypeOfIncome, sequelize } = require("../models");
const responseFormatter = require("../helpers/response_formatter");

const getIncomeListHandler = async (req, res, next) => {
  try {
    const startDate =
      req.query.from ?? moment().startOf("month").format("YYYY-MM-DD");
    const endDate =
      req.query.until ?? moment().endOf("month").format("YYYY-MM-DD");

    // ambil data user
    const user = req.user;

    const result = await Income.findAll({
      where: {
        user_id: user.id,
        date: {
          [Op.between]: [startDate, endDate],
        },
      },
    });

    return responseFormatter(
      res,
      200,
      "Berhasil mendapatkan riwayat pemasukan.",
      result
    );
  } catch (error) {
    next(error);
  }
};

const createIncomeHandler = async (req, res, next) => {
  const { type_id, description, amount, date } = req.body;

  // db begin transaction
  const transaction = await sequelize.transaction();
  try {
    // check type id
    const isTypeValid = await TypeOfIncome.isValidTypeID(type_id);
    if (!isTypeValid) {
      await transaction.rollback();
      return responseFormatter(res, 400, [
        "Jenis pemasukan yang dipilih tidak valid!",
      ]);
    }

    const newIncome = await Income.create(
      {
        user_id: req.user.id,
        type_id: req.body.type_id,
        amount: req.body.amount,
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
      },
      { transaction }
    );

    await transaction.commit();

    return responseFormatter(
      res,
      201,
      "Berhasil menambahkan catatan pemasukan.",
      newIncome
    );
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const updateIncomeHandler = async (req, res, next) => {
  const { id } = req.params;
  const { type_id, description, amount, date } = req.body;

  // db transaction
  const transaction = await sequelize.transaction();
  try {
    // cari data yang di update
    const data = await Income.findOne({
      where: { id },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!data) {
      await transaction.rollback();
      return responseFormatter(
        res,
        404,
        "Catatan pemasukan tidak dapat ditemukan!"
      );
    }

    // jika data bukan milik user
    if (data.user_id !== req.user.id) {
      await transaction.rollback();
      return responseFormatter(res, 403, "Catatan ini bukan milik Anda!");
    }

    // check type id
    const isTypeValid = await TypeOfIncome.isValidTypeID(req.body.type_id);
    if (!isTypeValid) {
      await transaction.rollback();
      return responseFormatter(res, 400, [
        "Jenis pemasukan yang dipilih tidak valid!",
      ]);
    }

    // update data with db transaction
    data.type_id = type_id;
    data.amount = amount;
    data.description = description;
    data.date = date;

    await data.save({ transaction });

    // commit changes
    await transaction.commit();

    return responseFormatter(
      res,
      200,
      "Berhasil memperbarui catatan pemasukan."
    );
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const deleteIncomeHandler = async (req, res, next) => {
  const { id } = req.params;

  // db transaction
  const transaction = await sequelize.transaction();

  try {
    // cari data yang di update
    const data = await Income.findOne({
      where: { id },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    // jika data tidak ada
    if (!data) {
      await transaction.rollback();
      return responseFormatter(
        res,
        404,
        "Catatan pemasukan tidak dapat ditemukan!"
      );
    }

    // jika data bukan milik user
    if (data.user_id !== req.user.id) {
      await transaction.rollback();
      return responseFormatter(res, 403, "Catatan ini bukan milik Anda!");
    }

    // delete data with db transaction
    await Income.destroy({ where: { id }, transaction });

    // commit changes
    await transaction.commit();

    return responseFormatter(res, 200, "Berhasil menghapus catatan pemasukan.");
  } catch (error) {
    await transaction.rollback();
    next(error);
  }
};

const getListIncomeTypeHandler = async (req, res, next) => {
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

module.exports = {
  getIncomeListHandler,
  createIncomeHandler,
  updateIncomeHandler,
  deleteIncomeHandler,
  getListIncomeTypeHandler,
};
