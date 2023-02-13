'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('service_reviews', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      service_id: {
        type: Sequelize.INTEGER,
        references: { model: 'customServices', key: "id" },
        onDelete: "cascade",
        onUpdate: "no action"
      },
      client_id: {
        type: Sequelize.INTEGER,
        references: { model: 'clientDetails', key: "id" },
        onDelete: "cascade",
        onUpdate: "no action"
      },
      rating: {
        type: Sequelize.ENUM('1','2','3','4','5'),
        comment:'1,2,3,4,5, => star⭐'
      },
      review: {
        type: Sequelize.TEXT
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
    await queryInterface.dropTable('service_reviews');
  }
};