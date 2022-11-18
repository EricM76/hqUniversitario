'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
              'Users',
              'payerId',
               Sequelize.STRING
             )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Users',
      'payerId',
       Sequelize.STRING
     )
  }
};
