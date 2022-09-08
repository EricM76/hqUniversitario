"use strict";

const months = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre']

const turns = months.map(month => {
  return {
    month,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Turns", turns, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Turns", null, {});
  },
};
