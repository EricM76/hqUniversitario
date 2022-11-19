'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
              'Notifications',
              'data',
               Sequelize.STRING
             )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Notifications',
      'data',
       Sequelize.STRING
     )
  }
};
