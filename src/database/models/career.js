'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Career extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Career.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    collegeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Career',
  });
  return Career;
};