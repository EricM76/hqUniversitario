'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Videos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      length: {
        type: Sequelize.INTEGER
      },
      locked: {
        type: Sequelize.BOOLEAN
      },
      visible: {
        type: Sequelize.BOOLEAN
      },
      courseId : {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Courses'
          },
          key: 'id'
        },
      },
      categoryId : {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Categories'
          },
          key: 'id'
        },
      },
      unitId : {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Units'
          },
          key: 'id'
        },
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
    await queryInterface.dropTable('Videos');
  }
};