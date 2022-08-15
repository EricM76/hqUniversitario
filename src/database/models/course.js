'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Course.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    description: DataTypes.STRING,
    review: DataTypes.STRING,
    teacherId: DataTypes.INTEGER,
    visible : DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Course',
    paranoid : true
  });
  return Course;
};