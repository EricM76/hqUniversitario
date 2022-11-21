"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      "Notifications",
      "paymentId",
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      "Notifications",
      "paymentId",
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },
};
