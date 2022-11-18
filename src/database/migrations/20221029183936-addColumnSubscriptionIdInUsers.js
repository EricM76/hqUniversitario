'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
              'Users',
              'subscriptionId',
               Sequelize.STRING
             )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Users',
      'subscriptionId',
       Sequelize.STRING
     )
  }
};
