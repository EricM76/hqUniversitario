"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Notifications", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      notificationId: {
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
      },
      data: {
        type: Sequelize.STRING,
      },
      action: {
        type: Sequelize.STRING,
      },
      live_mode: { type: Sequelize.BOOLEAN },
      date_created: { type: Sequelize.DATE },
      application_id: { type: Sequelize.INTEGER },
      user_id: { type: Sequelize.INTEGER },
      version: { type: Sequelize.INTEGER },
      api_version: { type: Sequelize.STRING },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Notifications");
  },
};
