"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    await queryInterface.bulkInsert("types_of_expense", [
      {
        name: "Kebutuhan Pokok",
        description: "Makanan, tempat tinggal, dan kebutuhan harian lainnya.",
        thumbnail:
          "http://127.0.0.1:3000/public/uploads/icon-expense-basic-needs.png",
      },
      {
        name: "Tagihan",
        description: "Biaya berlangganan atau cicilan.",
        thumbnail: "http://127.0.0.1:3000/public/uploads/icon-expense-bill.png",
      },
      {
        name: "Hiburan",
        description: "Pengeluaran untuk kebutuan sekunder",
        thumbnail:
          "http://127.0.0.1:3000/public/uploads/icon-expense-lifestyle.png",
      },
      {
        name: "Tabungan dan Investasi",
        description: "Alokasi dana untuk manabung atau investasi.",
        thumbnail:
          "http://127.0.0.1:3000/public/uploads/icon-expense-investment.png",
      },
      {
        name: "Donasi dan Berbagi",
        description: "Pengeluaran untuk berbagi dengan orang lain.",
        thumbnail:
          "http://127.0.0.1:3000/public/uploads/icon-expense-donation.png",
      },
      {
        name: "Pengeluaran Darurat",
        description: "Pengeluaran untuk keperluan mendesak.",
        thumbnail:
          "http://127.0.0.1:3000/public/uploads/icon-expense-emergency.png",
      },
      {
        name: "Lainnya",
        description: "Pengeluaran yang tidak termasuk dalam kategori di atas.",
        thumbnail:
          "http://127.0.0.1:3000/public/uploads/icon-expense-others.png",
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("types_of_expense", null, {});
  },
};
