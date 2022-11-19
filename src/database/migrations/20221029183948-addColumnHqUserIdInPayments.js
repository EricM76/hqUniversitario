'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
              'Payments',
              'hqUserId',
               Sequelize.INTEGER
             )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Payments',
      'hqUserId',
       Sequelize.INTEGER
     )
  }
};

