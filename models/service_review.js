'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class service_review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      service_review.belongsTo(models.customServices,{foreignKey:'service_id'})
    }
  }
  service_review.init({
    service_id: DataTypes.INTEGER,
    client_id: DataTypes.INTEGER,
    order_id: DataTypes.INTEGER,
    rating: DataTypes.ENUM('1', '2', '3', '4', '5'),
    review: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'service_review',
  });
  return service_review;
};