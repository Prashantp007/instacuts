'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      cart.belongsTo(models.customServices,{foreignKey:'service_id'});
    }
  }
  cart.init({
    client_id: DataTypes.INTEGER,
    service_id: DataTypes.INTEGER,
    schedule_date: DataTypes.DATEONLY,
    time_slot_id: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    cart_status:{type: DataTypes.ENUM('1','2'),defaultValue:'1'}
  }, {
    sequelize,
    modelName: 'cart',
  });
  return cart;
};