'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class clientAddress extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  clientAddress.init({
    client_id: DataTypes.INTEGER,
    latitude: DataTypes.FLOAT(10,6),
    longitude: DataTypes.FLOAT(10,6),
    location: DataTypes.STRING,
    from: DataTypes.ENUM("home", "work", "other")
  }, {
    sequelize,
    modelName: 'clientAddress',
  });
  return clientAddress;
};