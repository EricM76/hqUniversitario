"use strict";

const memberships = [
  {
    name: "BASIC",
    image: "defaultMembership.jpg",
    quota: 1,
    price: 500,
    description: "Acceso a todo el contenido completo de 1 materia",
    mp_checkout : "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c93808484532acc018454b16a9201e5",
  },
  
  {
    name: "PREMIUM",
    image: "defaultMembership.jpg",
    quota: 3,
    price: 750,
    description: "Acceso a todo el contenido completo de hasta 3 materias",
    mp_checkout : "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848451e648018454b48333038d",
  },

  {
    name: "PRO",
    image: "defaultMembership.jpg",
    quota: 5,
    price: 900,
    description: "Acceso a todo el contenido completo de hasta 5 materias",
    mp_checkout : "https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=2c9380848451e648018454b44601038b",
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
