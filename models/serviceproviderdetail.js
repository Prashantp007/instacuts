'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class serviceProviderDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  serviceProviderDetail.init({
    serviceProvider_id: DataTypes.INTEGER,
    serviceCategory: DataTypes.ENUM('1','2'),
    specification: DataTypes.ENUM('1'),
    experience: DataTypes.ENUM('1','2','3'),
    SSN_number: DataTypes.STRING,
    cosmetologyLicense: DataTypes.STRING,
    drivingLicense: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'serviceProviderDetail',
  });
  return serviceProviderDetail;
};