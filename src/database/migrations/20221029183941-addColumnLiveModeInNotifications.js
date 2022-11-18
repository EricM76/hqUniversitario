'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
              'Notifications',
              'live_mode',
               Sequelize.BOOLEAN
             )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Notifications',
      'live_mode',
       Sequelize.BOOLEAN
     )
  }
};
