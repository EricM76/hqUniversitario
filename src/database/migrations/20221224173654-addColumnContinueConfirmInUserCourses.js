'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'UserCourses',
      'continueConfirm',
       Sequelize.BOOLEAN
     )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'UserCourses',
      'continueConfirm',
       Sequelize.BOOLEAN
     )
  }
};

