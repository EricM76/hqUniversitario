'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  User.init({
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    terms: DataTypes.BOOLEAN,
    birthday: DataTypes.DATE,
    status:DataTypes.BOOLEAN,
    genreId: DataTypes.INTEGER,
    rolId: DataTypes.INTEGER,
    membershipId:DataTypes.INTEGER,
    entry: DataTypes.DATE,
    expires: DataTypes.DATE,
    address: DataTypes.INTEGER,
    city: DataTypes.INTEGER,
    province: DataTypes.INTEGER

  }, {
    sequelize,
    modelName: 'User',
    paranoid : true
  });
  return User;
};