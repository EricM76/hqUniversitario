'use strict';

const carreras1 = [
  "Arquitectura",
  "Diseño Industrial",
];

const carreras2 = [
  "Contador/a Público/a",
  "Lic. en Administración",
  "Lic. en Economía",
  "Prof. en Ciencias Económicas",
  "Lic. en Gestión Universitaria",
]

const carreras3 = [
  "Ing. Mecánica",
  "Ing. Electrónica",
  "Ing. Civil",
  "Ing. Industrial",
  "Ing. en Computación",
  "Prof. en Ciencias Biológicas",
  "Ciencias Biolócias",
  "Ciencias Geológicas",
  "Ing. en Agrimensura",
  "Ing. Aeronáutica",
  "Ing. Biomédica",
  "Constructor",
  "Ing. Ambiental",
  "Ing. Química",
  "Ing. Electromecánica",
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
"Lic. en Química",
"Lic. en Biotecnología",
]

const carreras6 = [
  "Lic. en Matemática",
  "Lic. en Física",
  "Lic. en Astronomía",
  "Lic. en Ciencias de la Computación",
  "Prof. en Matemática",
  "Prof. en Física",
  "Analista en Computación",
  "Lic. en Matemática Aplicada",
  "Tec. Universitaria en Matemática Aplicada",
]

const carreras7 = [
  "Medicina",
  "Enfermería Universitaria",
  "Lic. en Higiene y Seguridad en el Trabajo",
  "Tec. en Anestesia",
  "Tec. en Diagnóstico por Imágenes",
  "Tec. Universitaria en Hemoterapia",
  "Tec. universitaria en Laboratorio",
  "Tec. en Oftalmología",
  "Tec. universitaria en Quirófano"
]

const carreras8 = [
  "CBC",
]

const carreras9 = [
  "UBA XXI",
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

carreras_db = carreras7.map(carrera => {
  return {
    name: carrera,
    description: null,
    facultyId: 7,
    universityId: 2,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
});

carreras = [...carreras, ...carreras_db];

carreras_db = carreras8.map(carrera => {
  return {
    name: carrera,
    description: null,
    facultyId: 8,
    universityId: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
});

carreras = [...carreras, ...carreras_db];

carreras_db = carreras9.map(carrera => {
  return {
    name: carrera,
    description: null,
    facultyId: 9,
    universityId: 3,
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
