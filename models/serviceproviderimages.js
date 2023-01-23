'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class serviceProviderImages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      serviceProviderImages.belongsTo(models.serviceProvider,{foreignKey:'serviceProvider_id'})
    }
  }
  serviceProviderImages.init({
    serviceProvider_id: DataTypes.INTEGER,
    images: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'serviceProviderImages',
  });
  return serviceProviderImages;
};