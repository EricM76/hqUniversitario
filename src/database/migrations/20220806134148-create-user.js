'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      surname: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      terms: {
        type: Sequelize.BOOLEAN
      },
      birthday: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.BOOLEAN
      },
      genderId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Genders'
          },
          key: 'id'
        },
      },
      rolId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Rols'
          },
          key: 'id'
        },
      },
      membershipId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Memberships'
          },
          key: 'id'
        },
      },
      entry : {
        type: Sequelize.DATE,
      },
      expires : {
        type: Sequelize.DATE,
      },
      address: {
        type: Sequelize.STRING
      },
      city: {
        type: Sequelize.STRING
      },
      province: {
        type: Sequelize.STRING
      },
      social_id: {
        type: Sequelize.STRING
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
      },
      freeMembership: {
        type: Sequelize.BOOLEAN
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};