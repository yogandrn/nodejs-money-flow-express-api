"use strict";
const { Model } = require("sequelize");
const User = require("./user");
const TypeOfIncome = require("./type_of_income");
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
      user_id: DataTypes.BIGINT,
      type_id: DataTypes.BIGINT,
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
      amount: DataTypes.FLOAT,
      date: DataTypes.DATE,
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
