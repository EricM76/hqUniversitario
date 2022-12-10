"use strict";

const memberships = [
  {
    name: "BASIC",
    image: "defaultMembership.jpg",
    quota: 1,
    price: 900,
    description: "Acceso a todo el contenido completo de 1 materia por 30 días",
    days: 30,
    order: 1,
  },

  {
    name: "BASIC",
    image: "defaultMembership.jpg",
    quota: 1,
    price: 1650,
    description: "Acceso a todo el contenido completo de 1 materia por 90 días",
    days: 90,
    order: 2,
  },
  
  {
    name: "PRO",
    image: "defaultMembership.jpg",
    quota: 3,
    price: 1200,
    description: "Acceso a todo el contenido completo de hasta 3 materias por 30 días",
    days: 30,
    order: 3,
  },

  {
    name: "PRO",
    image: "defaultMembership.jpg",
    quota: 3,
    price: 2250,
    description: "Acceso a todo el contenido completo de hasta 3 materias por 90 días",
    days: 90,
    order: 4,
  },

  {
    name: "PREMIUM",
    image: "defaultMembership.jpg",
    quota: 5,
    price: 1500,
    description: "Acceso a todo el contenido completo de hasta 5 materias por 30 días", 
    days: 30,
    order: 5,
  },

  {
    name: "PREMIUM",
    image: "defaultMembership.jpg",
    quota: 5,
    price: 2850,
    description: "Acceso a todo el contenido completo de hasta 5 materias por 90 días", 
    days: 90,
    order: 6,
  },

  {
    name: "FREE",
    image: "defaultMembership.jpg",
    quota: 0,
    price: 0,
    description: "Acceso solo al contenido de muestra",
    days: 30,
    order: 7
  },

]

const membershipsWithDateTime = memberships.map(membership => {
  return {
    ...membership,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Memberships", membershipsWithDateTime, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Memberships", null, {});
  },
};
