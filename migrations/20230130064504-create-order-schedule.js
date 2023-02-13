'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('orderSchedules', {
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
      schedule_date:{
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      time_slot_id: {
        type: Sequelize.INTEGER,
        references: { model: 'timeSlotes', key: "id" },
        onDelete: "cascade",
        onUpdate: "no action"
      },
      schedule_type: {
        type: Sequelize.ENUM('1', '2', '3'),
        comment: '1 => scheduled_order,2 => custom_order,3 => on_demand_order',
        defaultValue:'1'
      },
      is_booked: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    await queryInterface.dropTable('orderSchedules');
  }
};