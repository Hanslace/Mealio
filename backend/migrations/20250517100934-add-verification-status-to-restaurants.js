'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'restaurants',      // name of the table
      'verification_status', // new column name
      {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        allowNull: false,
        defaultValue: 'pending',
        comment: 'Admin verification status'
      }
    );
  },

  async down (queryInterface, Sequelize) {
    // remove the column
    await queryInterface.removeColumn('restaurants', 'verification_status');
    // drop the enum type (Postgres only—no-ops on MySQL)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS enum_restaurants_verification_status;'
    );
  }
};
