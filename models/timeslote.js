'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class timeSlote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  timeSlote.init({
    day_id: DataTypes.INTEGER,
    slot_to: DataTypes.TIME,
    slot_from: DataTypes.TIME
  }, {
    sequelize,
    modelName: 'timeSlote',
  });
  return timeSlote;
};