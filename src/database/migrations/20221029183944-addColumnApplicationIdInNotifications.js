'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
              'Notifications',
              'application_id',
               Sequelize.INTEGER
             )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Notifications',
      'application_id',
       Sequelize.INTEGER
     )
  }
};

