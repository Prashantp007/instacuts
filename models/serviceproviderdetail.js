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
      serviceProviderDetail.belongsTo(models.serviceProvider,{as:'detail',foreignKey:'serviceProvider_id'})
    }
  }
  serviceProviderDetail.init({
    serviceProvider_id: DataTypes.INTEGER,
    serviceCategory: DataTypes.ENUM('1','2','3'),
    specification: DataTypes.ENUM('1','2','3'),
    experience: DataTypes.ENUM('1','2','3'),
    SSN_number: DataTypes.STRING,
    cosmetologyLicense: DataTypes.STRING,
    drivingLicense: DataTypes.STRING,
    about_me:DataTypes.TEXT,
    languages:DataTypes.JSON,
    skills:DataTypes.JSON,
    portfolio:DataTypes.TEXT,
    set_work_radios:DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'serviceProviderDetail',
  });
  return serviceProviderDetail;
};