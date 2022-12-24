'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'UserCourses',
      'continueConfirmationDate',
       Sequelize.DATE
     )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn(
      'UserCourses',
      'continueConfirmationDate',
       Sequelize.DATE
     )
  }
};

