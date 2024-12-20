const { Op } = require("sequelize");
const moment = require("moment");

const { Income, TypeOfIncome, sequelize } = require("../models");
const responseFormatter = require("../helpers/response_formatter");

const getIncomeListHandler = async (req, res, next) => {
  try {
    // handling user filter parameter
    const startDate = moment(req.query.from ?? moment().startOf("month"));
    const endDate = moment(req.query.until ?? moment().endOf("month"));
    const sortBy = req.query.sortBy ?? "earliest";
    const orderBy = sortBy === "latest" ? ["date", "DESC"] : ["date", "ASC"];

    const result = await sequelize.transaction(async (transaction) => {
      return await Income.findAll({
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
      });
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

  try {
    // create data with db transaction
    const newIncome = await sequelize.transaction(async (transaction) => {
      return await Income.create(
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
      "Berhasil menambahkan catatan pemasukan.",
      newIncome
    );
  } catch (error) {
    next(error);
  }
};

const updateIncomeHandler = async (req, res, next) => {
  const { id } = req.params;
  const { type_id, description, amount, date } = req.body;

  try {
    // update data with db transaction
    const result = await sequelize.transaction(async (transaction) => {
      // cari data yang di update
      let data = await Income.findOne({
        where: { id },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      if (!data) {
        throw new Error("Not found");
      }

      // jika data bukan milik user
      if (data.user_id !== req.user.id) {
        throw new Error("Non owner");
      }

      // changes value
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
      "Berhasil memperbarui catatan pemasukan.",
      result
    );
  } catch (error) {
    next(error);
  }
};

const deleteIncomeHandler = async (req, res, next) => {
  const { id } = req.params;

  try {
    // delete data with db transaction
    await sequelize.transaction(async (transaction) => {
      // cari data yang di delete
      const data = await Income.findOne({
        where: { id },
        lock: transaction.LOCK.UPDATE,
        transaction,
      });

      // jika data tidak ada
      if (!data) {
        throw new Error("Not found");
      }

      // jika data bukan milik user
      if (data.user_id !== req.user.id) {
        throw new Error("Non owner");
      }

      // delete data
      await Income.destroy({ where: { id }, transaction });
    });

    return responseFormatter(res, 200, "Berhasil menghapus catatan pemasukan.");
  } catch (error) {
    next(error);
  }
};

const getListIncomeTypeHandler = async (req, res, next) => {
  try {
    const data = await sequelize.transaction(async (transaction) => {
      return await TypeOfIncome.findAll({
        transaction,
        lock: transaction.LOCK.IN_SHARE_MODE,
      });
    });

    return responseFormatter(
      res,
      200,
      "Berhasil mendapatkan data jenis pemasukan.",
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
