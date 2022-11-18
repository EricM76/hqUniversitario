'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
              'Notifications',
              'user_id',
               Sequelize.INTEGER
             )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'Notifications',
      'user_id',
       Sequelize.INTEGER
     )
  }
};

