'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Answer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Answer.init({
    content: DataTypes.STRING,
    questionId: DataTypes.INTEGER,
    correct: DataTypes.BOOLEAN,
    score: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Answer',
    paranoid : true
  });
  return Answer;
};