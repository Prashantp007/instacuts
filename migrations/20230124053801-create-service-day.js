'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('serviceDays', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      serviceProvider_id: {
        type: Sequelize.INTEGER,
        references: { model: 'serviceProviders', key: "id" },
        onDelete: "cascade",
        onUpdate: "no action"
      },
      day: {
        type: Sequelize.ENUM("Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday")
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('serviceDays');
  }
};