'use strict';

const Courses =  [
  {
    name : 'Matemática para Ingreso',
    facultyId : 3, 
    universityId: 1,
  },
  {
    name : 'Física para Ingreso',
    facultyId : 3, 
    universityId: 1,
  },
  {
    name : 'Química para Ingreso',
    facultyId : 3, 
    universityId: 1,
  },
  {
    name : 'Introducción a la Matemática',
    facultyId : 3, 
    universityId: 1,
  },
  {
    name : 'Química Aplicada',
    facultyId : 3, 
    universityId: 1,
  },
  {
    name : 'Física I',
    facultyId : 3, 
    universityId: 1,
  },
  {
    name : 'Análisis Matemático I',
    facultyId : 3, 
    universityId: 1,
  },
  {
    name : 'Matemática para Biología y Geología',
    facultyId : 3, 
    universityId: 1,
  },
  {
    name : 'Física',
    facultyId : 4, 
    universityId: 1,
  },
  {
    name : 'Química',
    facultyId : 4, 
    universityId: 1,
  },
  {
    name : 'Biología',
    facultyId : 4, 
    universityId: 1,
  },
  {
    name : 'Introducción a la Medicina',
    facultyId : 4, 
    universityId: 1,
  },
  {
    name : 'Exámenes Integradores',
    facultyId : 4, 
    universityId: 1,
  },
  {
    name : 'Introducción a las Ciencias Químicas',
    facultyId : 5, 
    universityId: 1,
  },
  {
    name : 'Matemática I',
    facultyId : 5, 
    universityId: 1,
  },
  {
    name : 'Física I',
    facultyId : 5, 
    universityId: 1,
  },
  {
    name : 'Química General I',
    facultyId : 5, 
    universityId: 1,
  },
  {
    name : 'Ingreso a Arquitectura y Diseño Industrial',
    facultyId : 1, 
    universityId: 1,
  },
  {
    name : 'Matemática 1A',
    facultyId : 1, 
    universityId: 1,
  },
  {
    name : 'Matemática 1B',
    facultyId : 1, 
    universityId: 1,
  },
  {
    name : 'Matemática 1C',
    facultyId : 1, 
    universityId: 1,
  },
  {
    name : 'Física para Arquitectura y Diseño Industrial',
    facultyId : 1, 
    universityId: 1,
  },
  {
    name : 'Matemática',
    facultyId : 2, 
    universityId: 1,
  },
  {
    name : 'Economía',
    facultyId : 2, 
    universityId: 1,
  },
  {
    name : 'Curso de Nivelación',
    facultyId : 6, 
    universityId: 1,
  },
  {
    name : 'Análisis Matemático I',
    facultyId : 6, 
    universityId: 1,
  },
  {
    name : 'Biología',
    facultyId : 7, 
    universityId: 2,
  },
  {
    name : 'Física',
    facultyId : 7, 
    universityId: 2,
  },
  {
    name : 'Química',
    facultyId : 7, 
    universityId: 2,
  },
  {
    name : 'Matemática',
    facultyId : 8, 
    universityId: 3,
  },
  {
    name : 'Física',
    facultyId : 8, 
    universityId: 3,
  },
  {
    name : 'Biofísica',
    facultyId : 8, 
    universityId: 3,
  },
  {
    name : 'Química',
    facultyId : 8, 
    universityId: 3,
  },
  {
    name : 'Matemática',
    facultyId : 9, 
    universityId: 3,
  },
  {
    name : 'Física',
    facultyId : 9, 
    universityId: 3,
  },
  {
    name : 'Biofísica',
    facultyId : 9, 
    universityId: 3,
  },
  {
    name : 'Química',
    facultyId : 9, 
    universityId: 3,
  },
]

const CoursesDB = Courses.map(course => {
  return {
    ...course,
    image : 'exampleBanner.jpeg',
    video : null,
    description : null,
    review : null,
    teacherId : 1,
    visible : true,
    createdAt : new Date(),
    updatedAt : new Date()
  }
})


module.exports = {
  up: async (queryInterface, Sequelize) => {

    await queryInterface.bulkInsert('Courses', CoursesDB, {});
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.bulkDelete('Courses', null, {});

  }
};
