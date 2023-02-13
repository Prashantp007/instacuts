'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn("service_reviews", "order_id", {
        type: Sequelize.INTEGER,
        references: { model: 'orderdLists', key: "id" },
        onDelete: "cascade",
        onUpdate: "no action"
       
      })
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn("service_reviews", "order_id", {
        type: Sequelize.INTEGER,       
      })
    ])
  }
};
