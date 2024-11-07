const moment = require("moment");

const responseFormatter = require("../helpers/response_formatter");
const { Expense, Income, sequelize } = require("../models");
const { Op } = require("sequelize");

const dailyAnalyticHandler = async (req, res, next) => {
  try {
    const today = moment().format("YYYY-MM-DD");

    const queryOptions = { where: { user_id: req.user.id, date: today } };

    const totalIncome = await Income.sum("amount", queryOptions);
    const totalExpense = await Expense.sum("amount", queryOptions);

    return responseFormatter(
      res,
      200,
      "Berhasil mendapatkan data analitik harian.",
      { expense: totalExpense || 0, income: totalIncome || 0 }
    );
  } catch (error) {
    next(error);
  }
};

const weeklyAnalyticController = async (req, res, next) => {
  const { type } = req.query;
  try {
    const today = moment().startOf("day").format("YYYY-MM-DD");
    let days = [today];

    // ambil list tanggal 7 hari terakhir
    for (let i = 1; i <= 6; i++) {
      const date = moment(today).subtract(i, "days").format("YYYY-MM-DD");
      days.push(date);
    }
    // value terakhir dari days
    const sevenDaysAgo = days[days.length - 1];

    const queryOptions = {
      where: {
        user_id: req.user.id,
        date: {
          [Op.between]: [sevenDaysAgo, today],
        },
      },
      attributes: [
        [sequelize.fn("DATE", sequelize.col("date")), "date"],
        [sequelize.fn("SUM", sequelize.col("amount")), "total"],
      ],
      group: ["date"],
      order: [["date", "DESC"]],
    };

    // ambil query sesuai type (income/expense)
    const results =
      type.toUpperCase() === "INCOME"
        ? await Income.findAll(queryOptions)
        : await Expense.findAll(queryOptions);

    // mapping array
    const result = days.map((day) => {
      const data = results.find((data) => data.getDataValue("date") === day);
      return {
        date: day,
        total: data ? data.getDataValue("total") : 0,
      };
    });

    return responseFormatter(
      res,
      200,
      "Berhasil mendapatkan data analitik mingguan.",
      result
    );
  } catch (error) {
    next(error);
  }
};

const monthlyAnalyticHandler = async (req, res, next) => {
  try {
    const start = moment().startOf("month").format("YYYY-MM-DD");
    const end = moment().endOf("month").format("YYYY-MM-DD");

    const queryOptions = {
      where: { user_id: req.user.id, date: { [Op.between]: [start, end] } },
    };

    const totalIncome = await Income.sum("amount", queryOptions);
    const totalExpense = await Expense.sum("amount", queryOptions);

    return responseFormatter(
      res,
      200,
      "Berhasil mendapatkan data analitik bulanan.",
      {
        month: moment().format("YYYY-MM"),
        income: totalIncome || 0,
        expense: totalExpense || 0,
      }
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  dailyAnalyticHandler,
  weeklyAnalyticController,
  monthlyAnalyticHandler,
};
