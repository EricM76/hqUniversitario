'use strict';

const carreras1 = [
  "Arquitectura",
  "Diseño Industrial",
];

const carreras2 = [
  "Contador/a Público/a",
  "Licenciatura en Administración",
  "Licenciatura en Economía",
  "Profesorado en Ciencias Económicas",
  "Licenciatura en Gestión Universitaria",
]

const carreras3 = [
  "Ingeniería Mecánica",
  "Ingenería Electrónica",
  "Ingeniería Civil",
  "Ingeniería Industrial",
  "Ingeniería en Computación",
  "Profesorado en Ciencias Biológicas",
  "Ciencias Biolócias",
  "Ciencias Geológicas",
  "Ingenería en Agrimensura",
  "Ingeniería Aeronáutica",
  "Ingenería Biomédica",
  "Constructor",
  "Ingenería Ambiental",
  "Ingenería Química",
  "Ingeniería Electromecánica",
  "Técnico Mecánico Electricista",
]

const carreras4 = [
"Medicina",
"Enfermería",
"Fonoaudiología",
"Kinesiología y Fisioterapia",
"Nutrición",
"Tecnología Médica",
];

const carreras5 = [
"Bioquímica",
"Farmacia",
"Licenciatura en Química",
"Licenciatura en Biotecnología",
]

const carreras6 = [
  "Licenciatura en Matemática",
  "Licenciatura en Física",
  "Licenciatura en Astronomía",
  "Licenciatura en Ciencias de la Computación",
  "Profesorado en Matemática",
  "Profesorado en Física",
  "Analista en Computación",
  "Licenciatura en Matemática Aplicada",
  "Tecnicatura Universitaria en Matemática Aplicada",
]

let carreras = carreras1.map(carrera => {
  return {
    name: carrera,
    description: null,
    facultyId: 1,
    universityId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
});

let carreras_db = carreras2.map(carrera => {
  return {
    name: carrera,
    description: null,
    facultyId: 2,
    universityId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
})

carreras = [...carreras, ...carreras_db];

carreras_db = carreras3.map(carrera => {
  return {
    name: carrera,
    description: null,
    facultyId: 3,
    universityId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
});

carreras = [...carreras, ...carreras_db];

carreras_db = carreras4.map(carrera => {
  return {
    name: carrera,
    description: null,
    facultyId: 4,
    universityId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
})

carreras = [...carreras, ...carreras_db];

carreras_db = carreras5.map(carrera => {
  return {
    name: carrera,
    description: null,
    facultyId: 5,
    universityId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
});

carreras = [...carreras, ...carreras_db];

carreras_db = carreras6.map(carrera => {
  return {
    name: carrera,
    description: null,
    facultyId: 6,
    universityId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
});

carreras = [...carreras, ...carreras_db];


module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Careers', carreras, {});
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Careers', null, {});

  }
};
