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
      Career.belongsTo(models.University,{
        foreignKey: 'universityId',
        as : 'university'
      });

      Career.belongsTo(models.Faculty,{
        foreignKey: 'facultyId',
        as : 'faculty'
      });

      Career.belongsToMany(models.Course,{
        as : 'courses',
        through : 'CourseCareers',
        foreignKey : 'careerId',
        otherKey : 'courseId'
      });

    }
  };
  Career.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    facultyId: DataTypes.INTEGER,
    universityId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Career',
    paranoid : false
  });
  return Career;
};