'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
              'Payments',
              'deletedAt',
               Sequelize.DATE
             )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Payments',
      'deletedAt',
       Sequelize.DATE
     )
  }
};
