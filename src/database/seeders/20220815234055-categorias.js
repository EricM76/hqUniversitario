'use strict';

const categories =  [
  'Clases teóricas',
  'Trabajos prácticos',
  'Exámenes integradores',
  'Ciclo de nivelación',
  'Ejercicios integradores',
  'Exámenes anteriores'
]

const categoriesDB = categories.map(category => {
  return {
    name : category,
    createdAt : new Date(),
    updatedAt : new Date()
  }
})


module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Categories', categoriesDB, {});
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Categories', null, {});

  }
};
