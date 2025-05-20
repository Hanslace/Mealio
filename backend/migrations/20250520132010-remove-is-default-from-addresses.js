// migrations/20250520174532-remove-is-default-from-addresses.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('addresses', 'is_default');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('addresses', 'is_default', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    });
  },
};
