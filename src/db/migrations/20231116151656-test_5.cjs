'use strict';
const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
  //   /**
  //    * Add altering commands here.
  //    *
  //    * Example:
  //    * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
  //    */
    await queryInterface.removeColumn('Users', 'createdAt', DataTypes.DATE);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('Users', 'created_at', DataTypes.DATE);
    // await quesryInterface.dropColumn('Users', 'updated_at', DataTypes.DATE);
  }
};
