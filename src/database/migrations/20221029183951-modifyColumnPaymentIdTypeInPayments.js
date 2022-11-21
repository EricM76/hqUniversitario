"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      "Payments",
      "paymentId",
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      "Payments",
      "paymentId",
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },
};
