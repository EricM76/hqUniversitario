'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Faculty extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Faculty.belongsTo(models.University,{
        foreignKey : 'universityId',
        as : 'university'
      })
    }
  };
  Faculty.init({
    name: DataTypes.STRING,
    acronym: DataTypes.STRING,
    image: DataTypes.STRING,
    universityId : DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Faculty',
  });
  return Faculty;
};