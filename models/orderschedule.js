'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class orderSchedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      orderSchedule.belongsTo(models.timeSlote, { foreignKey: 'time_slot_id' });
      orderSchedule.hasMany(models.orderdList,{foreignKey:'order_schedule_id'})

    }
  }
  orderSchedule.init({
    client_id: DataTypes.INTEGER,
    schedule_date: DataTypes.DATEONLY,
    time_slot_id: DataTypes.INTEGER,
    schedule_type: { type: DataTypes.ENUM('1', '2', '3'), defaultValue: '1' },
    is_booked: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, {
    sequelize,
    modelName: 'orderSchedule',
  });
  return orderSchedule;
};