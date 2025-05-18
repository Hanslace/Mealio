'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'delivery_personnel', // or whatever your table is actually called
      'status',
      {
        type: Sequelize.ENUM('active', 'not_active', 'suspended'),
        allowNull: false,
        defaultValue: 'active',
        comment: 'Account status for delivery personnel'
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('delivery_personnel', 'status');
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS enum_delivery_personnel_status;'
    );
  }
};
