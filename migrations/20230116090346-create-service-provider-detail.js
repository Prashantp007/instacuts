'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('serviceProviderDetails', {
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
      serviceCategory: {
        type: Sequelize.ENUM('1', '2', '3'),
        comment: '1 => hairCare, 2 => facialCare, 3 => nailCare'
      },
      specification: {
        type: Sequelize.ENUM('1', '2', '3'),
        comment: '1 => hairStylist, 2 => barber, 3 => cosmetologist'
      },
      experience: {
        type: Sequelize.ENUM('1', '2', '3'),
        comment: '1 => junior, 2 => senior, 3 => advanced'
      },
      SSN_number: {
        type: Sequelize.STRING
      },
      cosmetologyLicense: {
        type: Sequelize.STRING
      },
      drivingLicense: {
        type: Sequelize.STRING
      },
      about_me: {
        type: Sequelize.TEXT
      },
      languages: {
        type: Sequelize.JSON
      },
      skills: {
        type: Sequelize.JSON
      },
      portfolio: {
        type: Sequelize.TEXT
      },
      set_work_radios: {
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('serviceProviderDetails');
  }
};