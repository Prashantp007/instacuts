'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customServices', {
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
      titel: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      category: {
        type: Sequelize.ENUM('1', '2', '3'),
        comment: '1 => hairCare, 2 => facialCare, 3 => nailCare'
      },
      price: {
        type: Sequelize.INTEGER
      },
      availableFor: {
        type: Sequelize.ENUM('1', '2', '3', '4'),
        comment: '1 => men,2 => women,3 => kids,4 => seniors'
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
    await queryInterface.dropTable('customServices');
  }
};