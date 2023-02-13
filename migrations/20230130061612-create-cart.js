'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('carts', {
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
        onDelete: "cascade",
        onUpdate: "no action"
      },
      schedule_date:{
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      time_slot_id: {
        type: Sequelize.INTEGER,
        references: { model: 'timeSlotes', key: "id" },
        onDelete: "no action",
        onUpdate: "no action"
      },
      price: {
        type: Sequelize.FLOAT
      },
      cart_status: {
        type: Sequelize.ENUM('1', '2'),
        comment: '1 => pending,2 => accepted',
        defaultValue:'1'
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
    await queryInterface.dropTable('carts');
  }
};