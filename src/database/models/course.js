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
      Course.belongsTo(models.University,{
        foreignKey: 'universityId',
        as : 'university'
      });

      Course.belongsTo(models.Faculty,{
        foreignKey: 'facultyId',
        as : 'faculty'
      });

      Course.hasMany(models.Feature,{
        foreignKey : 'courseId',
        as : 'features'
      });

      Course.hasMany(models.Note,{
        foreignKey : 'courseId',
        as : 'notes'
      });

      Course.hasMany(models.Unit,{
        foreignKey : 'courseId',
        as : 'units'
      });

      Course.hasMany(models.Video,{
        foreignKey : 'courseId',
        as : 'videos'
      });

      Course.hasMany(models.Test,{
        foreignKey : 'courseId',
        as : 'tests'
      });

      Course.belongsToMany(models.Career,{
        as : 'careers',
        through : 'CourseCareers',
        foreignKey : 'courseId',
        otherKey : 'careerId'
      });

      Course.belongsToMany(models.User,{
        as : 'users',
        through : 'UserCourse',
        foreignKey : 'courseId',
        otherKey : 'userId'
      });
      Course.belongsToMany(models.Turn,{
        as : 'turns',
        through : 'TurnCourses',
        foreignKey : 'courseId',
        otherKey : 'turnId'
      });
    }
  };
  Course.init({
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    video : DataTypes.STRING,
    description: DataTypes.STRING,
    review: DataTypes.STRING,
    teacherId: DataTypes.INTEGER,
    universityId: DataTypes.INTEGER,
    facultyId: DataTypes.INTEGER,
    visible : DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Course',
    paranoid : false
  });
  return Course;
};