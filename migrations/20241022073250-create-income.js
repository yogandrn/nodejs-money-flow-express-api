"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("incomes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
      },
      type_id: {
        allowNull: false,
        type: Sequelize.BIGINT,
        references: { model: "types_of_income", key: "id" },
        onUpdate: "CASCADE",
      },
      description: {
        allowNull: true,
        type: Sequelize.TEXT,
      },
      amount: {
        allowNull: false,
        type: Sequelize.FLOAT(15, 2),
      },
      date: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: "created_at",
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        allowNull: false,
        field: "updated_at",
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP on update CURRENT_TIMESTAMP"
        ),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("incomes");
  },
};
