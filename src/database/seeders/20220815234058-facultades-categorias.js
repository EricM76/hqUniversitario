"use strict";

const categories =  [
  {
    id : 1,
    name : 'Clases teóricas',
  },
  {
    id : 2,
    name: 'Trabajos prácticos',
  },
  {
    id : 3,
    name: 'Exámenes integradores',
  },
  {
    id : 4,
    name: 'Ciclo de nivelación',
  },
  {
    id : 5,
    name: 'Ejercicios integradores',
  },
  {
    id : 6,
    name: 'Exámenes anteriores'
  },
  
]
const faculties = [
  {
    id: 1,
    name: "Facultad de Arquitectura, Urbanismo Y Diseño",
    categories : [1,2,3]
  },
  {
    id: 2,
    name: "Facultad de Ciencias Económicas",
    categories : [1,2,3]
  },
  {
    id: 3,
    name: "Facultad de Ciencias Exactas, Física y Naturales",
    categories : [1,2,3]
  },
  {
    id: 4,
    name: "Facultad de Ciencias Médicas (UNC)",
    categories : [4,1,2,5]
  },
  {
    id: 5,
    name: "Facultad de Ciencias Químicas",
    categories : [1,2,3]
  },
  {
    id: 6,
    name: "Facultad de Matemática, Astronomía, Física y Computación",
    categories : [1,2,3]
  },
  {
    id: 7,
    name: "Facultad Ciencias Médicas (UNCUYO)",
    categories : [4,1,2,6]
  },
  {
    id: 8,
    name: "Ciclo Básico Común",
    categories : [4,1,2,6]
  },
  {
    id: 9,
    name: "Educación a Distancia de la UBA",
    categories : [4,1,2,6]
  }
]

let items = [];

faculties.forEach(faculty => {
  faculty.categories.forEach(category => {
    let item = {
      facultyId : faculty.id,
      categoryId : category,
      createdAt : new Date(),
    updatedAt : new Date(),
    };
    items.push(item)
  })
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("FacultyCategories", items, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("FacultyCategories", null, {});
  },
};
