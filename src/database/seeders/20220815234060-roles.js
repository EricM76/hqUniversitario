"use strict";

const rols = [
  {
    name: "ADMIN",
  },
  {
    name: "USER",
  },
]

const rolsWithDateTime = rols.map(rol => {
  return {
    ...rol,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Rols", rolsWithDateTime, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Rols", null, {});
  },
};
