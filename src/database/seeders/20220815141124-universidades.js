'use strict';

const universidades = [
  {
    "name": "Universidad Nacional de Córdoba",
    "image" : "unc_logo.png",
    "acronym": "UNC"
  },
  {
    "name": "Universidad Nacional de Cuyo",
    "image" : "uncuyo_logo.png",
    "acronym": "UNCUYO"
  },
  {
    "name": "Universidad de Buenos Aires",
    "image" : "uba_logo.png",
    "acronym": "UBA"
  },
]

const universidades_db = universidades.map(universidad => {
  return {
    ...universidad,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

})


module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Universities', universidades_db, {});
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Universities', null, {});

  }
};
