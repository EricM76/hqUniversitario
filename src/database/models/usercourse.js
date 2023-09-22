'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserCourse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserCourse.belongsTo(models.Course,{
        as : 'course',
        foreignKey : 'courseId',
      });
    }
  };
  UserCourse.init({
    userId: DataTypes.INTEGER,
    courseId: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN,
    assessment : DataTypes.INTEGER,
    comment : DataTypes.TEXT,
    progress : DataTypes.INTEGER,
    validated : DataTypes.BOOLEAN,
    continueConfirmationDate: DataTypes.DATE,
    continueConfirm: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'UserCourse',
    tableName : 'usercourses',
    paranoid : false
  });
  return UserCourse;
};