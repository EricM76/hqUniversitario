'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
              'Users',
              'confirmedSubscription',
               Sequelize.BOOLEAN
             )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Users',
      'confirmedSubscription',
       Sequelize.BOOLEAN
     )
  }
};
