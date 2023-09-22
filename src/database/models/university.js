'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class University extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      University.hasMany(models.Faculty,{
        foreignKey : 'universityId',
        as : 'faculties'
      });
      University.hasMany(models.Course,{
        foreignKey : 'universityId',
        as : 'courses'
      });
      University.hasMany(models.Career,{
        foreignKey : 'universityId',
        as : 'careers'
      });
    }
  };
  University.init({
    name: DataTypes.STRING,
    acronym: DataTypes.STRING,
    image: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'University',
    tableName : 'universities',
    paranoid : false
  });
  return University;
};