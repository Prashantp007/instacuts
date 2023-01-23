'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class customServices extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  customServices.init({
    serviceProvider_id: DataTypes.INTEGER,
    titel: DataTypes.STRING,
    description: DataTypes.TEXT,
    category: DataTypes.ENUM('1', '2', '3'),
    price: DataTypes.INTEGER,
    availableFor: DataTypes.ENUM('1', '2', '3', '4')
  }, {
    sequelize,
    modelName: 'customServices',
  });
  return customServices;
};