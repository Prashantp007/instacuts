'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class serviceProviderAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  serviceProviderAddress.init({
    serviceProvider_id: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip_code: DataTypes.INTEGER,
    latitude: DataTypes.FLOAT(10,6),
    longitude: DataTypes.FLOAT(10,6)
  }, {
    sequelize,
    modelName: 'serviceProviderAddress',
  });
  return serviceProviderAddress;
};