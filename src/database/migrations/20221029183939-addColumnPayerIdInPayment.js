'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
              'Payments',
              'payerId',
               Sequelize.STRING
             )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Payments',
      'payerId',
       Sequelize.STRING
     )
  }
};
