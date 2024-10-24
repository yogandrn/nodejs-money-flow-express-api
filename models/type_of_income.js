"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TypeOfIncome extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TypeOfIncome.init(
    {
      name: DataTypes.STRING,
      thumbnail: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "TypeOfIncome",
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "types_of_income",
    }
  );
  return TypeOfIncome;
};
