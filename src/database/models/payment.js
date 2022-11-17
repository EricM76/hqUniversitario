'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Payment.init({
    paymentId: DataTypes.INTEGER,
    description: DataTypes.STRING,
    payer_email: DataTypes.STRING,
    payer_details: DataTypes.STRING,
    payment_method_id: DataTypes.STRING,
    status: DataTypes.STRING,
    status_detail: DataTypes.STRING,
    transaction_amount: DataTypes.STRING,
    hqUserId: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'Payment',
    paranoid : true
  });
  return Payment;
};