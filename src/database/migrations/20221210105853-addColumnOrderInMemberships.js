'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Memberships',
      'order',
       Sequelize.BOOLEAN
     )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Memberships',
      'order',
       Sequelize.BOOLEAN
     )
  }
};

