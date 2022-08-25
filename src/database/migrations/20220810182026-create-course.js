'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Courses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      image: {
        type: Sequelize.STRING
      },
      video: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      review: {
        type: Sequelize.STRING
      },
      teacherId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Teachers'
          },
          key: 'id'
        },
      },
      universityId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Universities'
          },
          key: 'id'
        },
      },
      facultyId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Faculties'
          },
          key: 'id'
        },
      },
      visible : {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Courses');
  }
};