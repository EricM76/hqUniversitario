'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Question extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Question.hasMany(models.Answer, {
        foreignKey : 'questionId',
        as : 'answers',
        onDelete : 'cascade'
      })
    }
  };
  Question.init({
    content: DataTypes.STRING,
    testId: DataTypes.INTEGER,
    score : DataTypes.INTEGER,
    image : DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Question',
    tableName : 'questions'
  });
  return Question;
};