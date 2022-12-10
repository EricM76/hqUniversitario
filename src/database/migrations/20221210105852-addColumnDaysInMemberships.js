'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'Memberships',
      'days',
       Sequelize.BOOLEAN
     )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Memberships',
      'days',
       Sequelize.BOOLEAN
     )
  }
};

