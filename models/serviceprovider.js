'use strict';
const {
  Model, INTEGER
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class serviceProvider extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  serviceProvider.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    DOB: DataTypes.DATE,
    gender: DataTypes.ENUM('male','female'),
    mobile_number: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    profile_picture: DataTypes.STRING,
    OTP: DataTypes.INTEGER,
    is_verify: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'serviceProvider',
  });
  return serviceProvider;
};