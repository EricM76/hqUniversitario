'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Referred extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        as : 'users',
        foreignKey : 'userId'
      })
    }
  };
  Referred.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    active: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
    code : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Referred',
    paranoid : true
  });
  return Referred;
};