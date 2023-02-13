'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orders', {
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
      total_services: {
        type: Sequelize.INTEGER
      },
      service_charges: {
        type: Sequelize.FLOAT
      },
      convenience_fee: {
        type: Sequelize.FLOAT
      },
      discount: {
        type: Sequelize.FLOAT
      },
      voucher: {
        type: Sequelize.FLOAT
      },
      tax: {
        type: Sequelize.FLOAT
      },
      total_amount: {
        type: Sequelize.FLOAT
      },
      payment_method: {
        type: Sequelize.ENUM('1'),
        comment : '1=>creditCard'
      },
      order_status: {
        type: Sequelize.ENUM('1','2','3','4'),
        comment:'1=>pending,2=>accepted,3=>rejected,4=>cancel',
        defaultValue:'1'
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
    await queryInterface.dropTable('orders');
  }
};