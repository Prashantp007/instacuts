'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderdList extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      orderdList.belongsTo(models.customServices,{foreignKey:'service_id'})
      orderdList.belongsTo(models.clientAddress,{foreignKey:'client_address_id'})
      orderdList.belongsTo(models.orderSchedule,{foreignKey:'order_schedule_id'})
    }
  }
  orderdList.init({
    client_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    order_schedule_id: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    order_status: {type:DataTypes.ENUM('1','2','3','4','5'),defaultValue:'1'},
    client_address_id: DataTypes.INTEGER,
    payment_method:{type: DataTypes.ENUM('1'),defaultValue:'1'},
    otp:DataTypes.INTEGER,
    otp_verify:{type: DataTypes.BOOLEAN, defaultValue:false},
    complete_status:{type: DataTypes.BOOLEAN, defaultValue:false}
  }, {
    sequelize,
    modelName: 'orderdList',
  });
  return orderdList;
};