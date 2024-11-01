const { Op } = require("sequelize");
const moment = require("moment");

const { Expense, TypeOfExpense, sequelize } = require("../models");
const responseFormatter = require("../helpers/response_formatter");

const getExpenseListHandler = async (req, res, next) => {
  try {
    // handling user filter parameter
    const startDate = moment(req.query.from ?? moment().startOf("month"));
    const endDate = moment(req.query.until ?? moment().endOf("month"));
    const typeID = req.query.type;
    const sortBy = req.query.sortBy ?? "earliest";
    const orderBy = sortBy === "latest" ? ["date", "DESC"] : ["date", "ASC"];

    const result = await sequelize.transaction(async (transaction) => {
      return await Expense.findAll({
        where: {
          user_id: req.user.id,
          date: {
            [Op.between]: [
              startDate.format("YYYY-MM-DD"),
              endDate.format("YYYY-MM-DD"),
            ],
          },
        },
        include: ["type"],
        order: [orderBy],
        lock: transaction.LOCK.IN_SHARE_MODE,
        transaction,
      });
    });

    return responseFormatter(
      res,
      200,
      "Berhasil mendapatkan riwayat pengeluaran.",
      result
    );
  } catch (error) {
    next(error);
  }
};

const createExpenseHandler = async (req, res, next) => {
  const { type_id, description, amount, date } = req.body;

  try {
    // create data with db transaction
    const newExpense = await sequelize.transaction(async (transaction) => {
      return await Expense.create(
        {
          user_id: req.user.id,
          type_id: type_id,
          amount: amount,
          description: description,
          date: date,
        },
        { transaction }
      );
    });

    return responseFormatter(
      res,
      201,
      "Berhasil menambahkan catatan pengeluaran.",
      newExpense
    );
  } catch (error) {
    next(error);
  }
};

const updateExpenseHandler = async (req, res, next) => {
  const { id } = req.params;
  const { type_id, description, amount, date } = req.body;

  try {
    // update data with db transaction
    const result = await sequelize.transaction(async (transaction) => {
      // cari data yang di update
      const data = await Expense.findOne({
        where: { id },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      // jika tidak ada
      if (!data) {
        throw new Error("Not found");
      }

      // jika data bukan milik user
      if (data.user_id !== req.user.id) {
        throw new Error("Non owner");
      }

      // save updated data
      data.type_id = type_id;
      data.amount = amount;
      data.description = description;
      data.date = date;

      await data.save({ transaction });

      return data;
    });

    return responseFormatter(
      res,
      200,
      "Berhasil memperbarui catatan pengeluaran.",
      result
    );
  } catch (error) {
    next(error);
  }
};

const deleteExpenseHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    // delete data with db transaction
    await sequelize.transaction(async (transaction) => {
      // cari data yang di update
      const data = await Expense.findOne({
        where: { id },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      // jika tidak ada
      if (!data) {
        throw new Error("Not found");
      }

      // jika data bukan milik user
      if (data.user_id !== req.user.id) {
        throw new Error("Non owner");
      }

      // delete data
      await Expense.destroy({ where: { id }, transaction });
    });

    return responseFormatter(
      res,
      200,
      "Berhasil menghapus catatan pengeluaran."
    );
  } catch (error) {
    next(error);
  }
};

const getListExpenseTypeHandler = async (req, res, next) => {
  try {
    const data = await sequelize.transaction(async (transaction) => {
      return await TypeOfExpense.findAll({
        transaction,
        lock: transaction.LOCK.IN_SHARE_MODE,
      });
    });

    return responseFormatter(
      res,
      200,
      "Berhasil mendapatkan data jenis pengeluaran.",
      data
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExpenseListHandler,
  createExpenseHandler,
  updateExpenseHandler,
  deleteExpenseHandler,
  getListExpenseTypeHandler,
};
