'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('clientAddresses', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      client_id: {
        type: Sequelize.INTEGER,
        references:{model:"clientDetails",key:"id"},
        onDelete:"cascade",
        onUpdate:"no action"
      },
      latitude: {
        type: Sequelize.FLOAT(10,6)
      },
      longitude: {
        type: Sequelize.FLOAT(10,6)
      },
      location: {
        type: Sequelize.STRING
      },
      from: {
        type: Sequelize.ENUM("home", "work", "other")
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
    await queryInterface.dropTable('clientAddresses');
  }
};