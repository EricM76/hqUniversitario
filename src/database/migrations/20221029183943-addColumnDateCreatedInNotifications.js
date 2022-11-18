'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
              'Notifications',
              'date_created',
               Sequelize.DATE
             )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Notifications',
      'date_created',
       Sequelize.DATE
     )
  }
};
