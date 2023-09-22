'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.hasMany(models.User, {
        foreignKey: "membershipId",
        as:"users",
      })
    }
  };
  Membership.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    quota: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    description: DataTypes.STRING,
    days: DataTypes.INTEGER,
    order: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Membership',
    tableName : 'memberships',
    paranoid : false
  });
  return Membership;
};