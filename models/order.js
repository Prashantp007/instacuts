'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order.init({
    client_id: DataTypes.INTEGER,
    total_services: DataTypes.INTEGER,
    service_charges: DataTypes.FLOAT,
    convenience_fee: DataTypes.FLOAT,
    discount: DataTypes.FLOAT,
    voucher: DataTypes.FLOAT,
    tax: DataTypes.FLOAT,
    total_amount: DataTypes.FLOAT,
    payment_method: {type:DataTypes.ENUM('1'),defaultValue:'1'},
    order_status: {type:DataTypes.ENUM('1','2','3','4'),defaultValue:'1'},
    complete_status:{type: DataTypes.BOOLEAN, defaultValue:false}
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};