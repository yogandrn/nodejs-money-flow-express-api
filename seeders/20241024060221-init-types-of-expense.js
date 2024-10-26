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
      },
      {
        name: "Tagihan",
        description: "Biaya berlangganan atau cicilan.",
      },
      {
        name: "Hiburan",
        description: "Pengeluaran untuk kebutuan sekunder",
      },
      {
        name: "Tabungan dan Investasi",
        description: "Alokasi dana untuk manabung atau investasi.",
      },
      {
        name: "Pengeluaran Darurat",
        description: "Pengeluaran untuk keperluan mendesak.",
      },
      {
        name: "Lainnya",
        description: "Pengeluaran yang tidak termasuk dalam kategori di atas.",
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
