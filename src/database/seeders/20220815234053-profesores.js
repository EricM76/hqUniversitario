'use strict';

const Teachers =  [
  {
    name : 'Carlos',
    surname : 'Torrez',
    image : 'noImage.png',
    degree : 'Ing.',
    createdAt : new Date(),
    updatedAt: new Date()
  }
]


module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Teachers', Teachers, {});
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Teachers', null, {});

  }
};
