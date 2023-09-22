'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserTest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserTest.init({
    userId: DataTypes.INTEGER,
    testId: DataTypes.INTEGER,
    courseId : DataTypes.INTEGER,
    totalScore: DataTypes.INTEGER,
    score: DataTypes.INTEGER,
    corrects: DataTypes.INTEGER,
    effectiveness: DataTypes.INTEGER,
    time: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserTest',
    tableName : 'usertests'
  });
  return UserTest;
};