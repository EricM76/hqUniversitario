'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Notification.init({
    notificationId: DataTypes.INTEGER,
    type: DataTypes.STRING,
    data: DataTypes.STRING,
    action: DataTypes.STRING,
    live_mode: DataTypes.BOOLEAN,
    date_created: DataTypes.DATE,
    application_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    version: DataTypes.INTEGER,
    api_version: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Notification',
    paranoid : true
  });
  return Notification;
};