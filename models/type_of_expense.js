"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TypeOfExpense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }

    static async isValidTypeID(id) {
      const result = await TypeOfExpense.findByPk(id);
      return result === null ? false : true;
    }
  }
  TypeOfExpense.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            args: true,
            msg: "Nama jenis pengeluaran tidak boleh kosong!",
          },
          notEmpty: {
            args: true,
            msg: "Nama jenis pengeluaran tidak boleh kosong!",
          },
          len: {
            args: [4, 255],
            msg: "Nama jenis pengeluaran harus antara 4 sampai 255 karakter.",
          },
          is: {
            args: /^[a-zA-Z\s]*$/,
            msg: "Nama jenis pengeluaran hanya boleh berisi huruf!",
          },
        },
      },
      thumbnail: { type: DataTypes.STRING, allowNull: true },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: /^[a-zA-Z0-9.,?:%/()\s]*$/,
            msg: "Deskripsi hanya boleh berisi huruf dan tanda baca!",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "TypeOfExpense",
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "types_of_expense",
    }
  );
  return TypeOfExpense;
};
