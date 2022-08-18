'use strict';

const facultades = [
  {
    "name": "Facultad de Arquitectura, Urbanismo Y Diseño",
    "acronym": "FAUD",
    "image" : null,
    "universityId" : 1 
  },
  {
    "name": "Facultad de Ciencias Económicas",
    "acronym": "FCE",
    "image" : null,
    "universityId" : 1 
  },
  {
    "name": "Facultad de Ciencias Exactas, Física y Naturales",
    "acronym": "FCEFyN",
    "image" : null,
    "universityId" : 1 
  },
  {
    "name": "Facultad de Ciencias Médicas",
    "acronym": "FCM",
    "image" : null,
    "universityId" : 1 
  },
  {
    "name": "Facultad de Ciencias Químicas",
    "acronym": "FCQ",
    "image" : null,
    "universityId" : 1 
  },
  {
    "name": "Facultad de Matemática, Astronomía, Física y Computación",
    "acronym": "FAMAF",
    "image" : null,
    "universityId" : 1 
  },
  {
    "name": "Facultad Ciencias Médicas",
    "acronym": "FCM",
    "image" : null,
    "universityId" : 2
  },
]


const facultades_db = facultades.map(universidad => {
  return {
    ...universidad,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

})


module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Faculties', facultades_db, {});
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Faculties', null, {});

  }
};
