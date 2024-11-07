"use strict";
const { Model } = require("sequelize");

const { isDateBeforeTommorow } = require("../helpers/validate_helper");

module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    static associate(models) {
      // define association here
      Expense.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
      });

      Expense.belongsTo(models.TypeOfExpense, {
        foreignKey: "type_id",
        targetKey: "id",
        as: "type",
      });
    }
  }

  Expense.init(
    {
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: { args: true, msg: "ID Pengguna tidak boleh kosong!" },
          isInt: { args: true, msg: "ID Pengguna harus berupa angka!" },
        },
      },
      type_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "ID Tipe Pengeluaran tidak boleh kosong!",
          },
          isInt: { args: true, msg: "ID Tipe Pengeluaran harus berupa angka!" },
          async isValidType(value) {
            const isValid = await sequelize.models.TypeOfExpense.isValidTypeID(
              value
            );
            if (!isValid) {
              throw new Error("Jenis pengeluaran yang dipilih tidak valid!");
            }
          },
        },
      },
      description: { type: DataTypes.TEXT, allowNull: true },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          notNull: { args: true, msg: "Tanggal tidak boleh kosong!" },
          isNumeric: { args: true, msg: "Jumlah nominal harus berupa angka!" },
        },
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: { args: true, msg: "Tanggal tidak boleh kosong!" },
          notEmpty: { args: true, msg: "Tanggal tidak boleh kosong!" },
          isDate: { args: true, msg: "Format tanggal tidak valid!" },

          isAfter: {
            args: "1999-12-31",
            msg: "Tanggal tidak boleh sebelum tahun 2000!",
          },
          isBeforeTomorrow(value) {
            const isValid = isDateBeforeTommorow(value);
            if (!isValid) {
              throw new Error("Tanggal tidak boleh melebihi hari ini!");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Expense",
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "expenses",
    }
  );

  return Expense;
};
