'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
              'Users',
              'verify',
               Sequelize.BOOLEAN
             )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Users',
      'verify',
       Sequelize.BOOLEAN
     )
  }
};
