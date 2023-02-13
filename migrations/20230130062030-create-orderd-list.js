'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orderdLists', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      client_id: {
        type: Sequelize.INTEGER,
        references: { model: 'clientDetails', key: "id" },
        onDelete: "cascade",
        onUpdate: "no action"
      },
      service_id: {
        type: Sequelize.INTEGER,
        references: { model: 'customServices', key: "id" },
        onDelete: "no action",
        onUpdate: "no action"
      },
      order_id: {
        type: Sequelize.INTEGER,
        references: { model: 'orders', key: "id" },
        onDelete: "no action",
        onUpdate: "no action"
      },
      order_schedule_id: {
        type: Sequelize.INTEGER,
        references: { model: 'orderSchedules', key: "id" },
        onDelete: "no action",
        onUpdate: "no action"
      },
      price: {
        type: Sequelize.FLOAT
      },
      order_status: {
        type: Sequelize.ENUM('1','2','3','4'),
        comment : '1=>pending,2=>accepted,3=>rejected,4=>cancel',
        defaultValue:'1'
      },
      client_address_id: {
        type: Sequelize.INTEGER,
      },
      payment_method: {
        type: Sequelize.ENUM('1'),
        defaultValue:'1',
        comment : '1=>creditCard'
      },
      otp: {
        type: Sequelize.INTEGER,
      },
      complete_status: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
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
    await queryInterface.dropTable('orderdLists');
  }
};