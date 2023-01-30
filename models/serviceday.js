'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class serviceDay extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  serviceDay.init({
    serviceProvider_id: DataTypes.INTEGER,
    day: DataTypes.ENUM("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday")
  }, {
    sequelize,
    modelName: 'serviceDay',
  });
  return serviceDay;
};