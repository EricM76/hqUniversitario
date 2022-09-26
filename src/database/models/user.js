'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.belongsTo(models.Rol, {
        foreignKey: "rolId",
        as: "rol"
      })
      
      User.belongsTo(models.Membership, {
        foreignKey: "membershipId",
        as: "membership"
      })

      User.hasMany(models.Referred, {
        foreignKey: "userId",
        as: "referreds"
      })

      User.belongsToMany(models.Course,{
        as : 'courses',
        through : 'UserCourse',
        foreignKey : 'userId',
        otherKey : 'courseId'
      });
    }
  };
  User.init({
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    terms: DataTypes.BOOLEAN,
    birthday: DataTypes.DATE,
    status:DataTypes.BOOLEAN,
    genderId: DataTypes.INTEGER,
    rolId: DataTypes.INTEGER,
    membershipId:DataTypes.INTEGER,
    entry: DataTypes.DATE,
    expires: DataTypes.DATE,
    address: DataTypes.INTEGER,
    city: DataTypes.INTEGER,
    province: DataTypes.INTEGER,
    social_id: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    paranoid : true
  });
  return User;
};