'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('timeSlotes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      day_id: {
        type: Sequelize.INTEGER,
        references: { model: 'serviceDays', key: "id" },
        onDelete: "cascade",
        onUpdate: "no action"
      },
      slot_to: {
        type: Sequelize.TIME,
        defaultValue: '00:00:00'
      },
      slot_from: {
        type: Sequelize.TIME,
        defaultValue: '00:00:00'
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
    await queryInterface.dropTable('timeSlotes');
  }
};