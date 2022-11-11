"use strict";
const bcryptjs = require('bcryptjs')
const { v4: uuidv4 } = require('uuid');

const users = [
  {
    name: "ADMIN",
    surname: "HQ",
    email : "hq.universitario@gmail.com",
    password: bcryptjs.hashSync('apoyo22'),
    terms : 1,
    rolId : 1,
    verify: 1,
    code : uuidv4()
  },
  {
    name: "USER",
    surname: "HQ",
    email : "user.hq@gmail.com",
    password: bcryptjs.hashSync('apoyohq22'),
    terms : 1,
    rolId : 2,
    verify: 1,
    code : uuidv4()
  },
]

const usersWithDateTime = users.map(user => {
  return {
    ...user,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
});

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("Users", usersWithDateTime, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Users", null, {});
  },
};
