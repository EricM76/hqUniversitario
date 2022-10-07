'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CourseCareer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  CourseCareer.init({
    courseId: DataTypes.INTEGER,
    careerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'CourseCareer',
  });
  return CourseCareer;
};