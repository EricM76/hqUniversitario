'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
              'Memberships',
              'mp_id',
               Sequelize.STRING
             )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Memberships',
      'mp_id',
       Sequelize.STRING
     )
  }
};
