"use strict";

const memberships = [
  {
    name: "BASIC",
    image: "defaultMembership.jpg",
    quota: 1,
    price: 500,
    description: "Acceso a todo el contenido completo de 1 materia",
  },
  
  {
    name: "PREMIUM",
    image: "defaultMembership.jpg",
    quota: 3,
    price: 750,
    description: "Acceso a todo el contenido completo de hasta 3 materias",
  },

  {
    name: "PRO",
    image: "defaultMembership.jpg",
    quota: 5,
    price: 900,
    description: "Acceso a todo el contenido completo de hasta 5 materias",
  },

  {
    name: "FREE",
    image: "defaultMembership.jpg",
    quota: 1,
    price: 0,
    description: "Acceso a todo el contenido completo de 1 materia",
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
