'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Test extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Test.hasMany(models.Question,{
        foreignKey : 'testId',
        as : 'questions',
        onDelete : 'cascade'
      });

      Test.belongsToMany(models.User,{
        as : 'users',
        through : 'UserTests',
        foreignKey : 'testId',
        otherKey : 'userId'
      });
    }
  };
  Test.init({
    name: DataTypes.STRING,
    score: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER,
    time : DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Test',
    tableName : 'tests'
  });
  return Test;
};