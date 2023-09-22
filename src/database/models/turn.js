'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Turn extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Turn,{
        as : 'courses',
        through : 'TurnCourses',
        foreignKey : 'turnId',
        otherKey : 'courseId'
      });
    }
  };
  Turn.init({
    month: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Turn',
    tableName : 'turns'
  });
  return Turn;
};