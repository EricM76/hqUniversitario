'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Video extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Video.belongsTo(models.Course,{
        foreignKey : 'courseId',
        as : 'course'
      });
      Video.belongsTo(models.Category,{
        foreignKey : 'categoryId',
        as : 'category'
      });
      Video.belongsTo(models.Unit,{
        foreignKey : 'unitId',
        as : 'unit'
      });
      Video.belongsTo(models.Turn,{
        foreignKey : 'turnId',
        as : 'turn'
      });
      Video.belongsTo(models.Year,{
        foreignKey : 'yearId',
        as : 'year'
      });
    }
  };
  Video.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    length: DataTypes.NUMBER,
    locked: DataTypes.BOOLEAN,
    visible: DataTypes.BOOLEAN,
    courseId : DataTypes.INTEGER,
    categoryId : DataTypes.INTEGER,
    unitId : DataTypes.INTEGER,
    turnId : DataTypes.INTEGER,
    yearId : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Video',
    paranoid : true
  });
  return Video;
};