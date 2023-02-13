'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return Promise.all([
      queryInterface.addColumn("orderdLists", "otp_verify", {
        type: Sequelize.BOOLEAN,
        defaultValue:false
      }),
      queryInterface.changeColumn("orderdLists","order_status",{
        type: Sequelize.ENUM('1','2','3','4','5'),
        comment : '1=>pending,2=>accepted,3=>rejected,4=>cancel,5=>start',
        defaultValue:'1'
      })
    ])
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return Promise.all([
      queryInterface.removeColumn("orderdLists", "otp_verify", {
        type: Sequelize.BOOLEAN,
      }),
      queryInterface.changeColumn("orderdLists","order_status",{
        type: Sequelize.ENUM('1','2','3','4'),
        comment : '1=>pending,2=>accepted,3=>rejected,4=>cancel',
        defaultValue:'1'
      })
    ])
  }
};
