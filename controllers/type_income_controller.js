const responseFormatter = require("../helpers/response_formatter");
const { TypeOfIncome } = require("../models");

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

module.exports = { getTypeIncomeListHandler };
