"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      "Notifications",
      "application_id",
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn(
      "Notifications",
      "application_id",
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },
};
