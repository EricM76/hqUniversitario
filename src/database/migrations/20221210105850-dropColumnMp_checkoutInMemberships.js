'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Memberships',
      'mp_checkout',
       Sequelize.BOOLEAN
     )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Memberships',
      'mp_checkout',
       Sequelize.BOOLEAN
     )
  }
};
