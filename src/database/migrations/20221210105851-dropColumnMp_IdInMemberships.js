'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Memberships',
      'mp_id',
       Sequelize.BOOLEAN
     )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Memberships',
      'mp_id',
       Sequelize.BOOLEAN
     )
  }
};

