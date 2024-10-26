"use strict";
const { Model } = require("sequelize");

const User = require("./user");
const TypeOfIncome = require("./type_of_income");
const { isDateBeforeTommorow } = require("../helpers/validate_halper");

module.exports = (sequelize, DataTypes) => {
  class Income extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Income.belongsTo(models.User, {
        foreignKey: "user_id",
        targetKey: "id",
        as: "user",
      });

      Income.belongsTo(models.TypeOfIncome, {
        foreignKey: "type_id",
        targetKey: "id",
        as: "type",
      });
    }
  }
  Income.init(
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
          notNull: { args: true, msg: "ID Tipe Pemasukan tidak boleh kosong!" },
          isInt: { args: true, msg: "ID Tipe Pemasukan harus berupa angka!" },
        },
      },
      // title: {
      //   type: DataTypes.TEXT,
      //   allowNull: false,
      //   validate: {
      //     notNull: { args: true, msg: "Nama pemasukan tidak boleh kosong!" },
      //     notEmpty: { args: true, msg: "Nama pemasukan tidak boleh kosong!" },
      //     len: {
      //       args: [3, 255],
      //       msg: "Jumlah karakter antara 3 sampai 255 karakter.",
      //     },
      //     is: {
      //       args: /^[a-zA-Z0-9.,()%-_*:"\s]*$/,
      //       msg: "Hanya boleh berisi huruf, angka dan beberapa simbol/karakter!",
      //     },
      //   },
      // },
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
      modelName: "Income",
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "incomes",
    }
  );
  return Income;
};
