'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
              'Users',
              'pendingMembershipId',
               Sequelize.BOOLEAN
             )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Users',
      'pendingMembershipId',
       Sequelize.BOOLEAN
     )
  }
};
