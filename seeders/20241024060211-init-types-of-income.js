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
    await queryInterface.bulkInsert("types_of_income", [
      { name: "Gaji", description: "Pemasukan dari pekerjaan tetap." },
      {
        name: "Investasi",
        description: "Pendapatan dari instrumen investasi.",
      },
      { name: "Hadiah", description: "Uang yang diterima sebagai pemberian." },
      {
        name: "Lainnya",
        description: "Pemasukan yang tidak termasuk dalam kategori di atas.",
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
    await queryInterface.bulkDelete("types_of_income", null, {});
  },
};
