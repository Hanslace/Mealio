'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'delivery_personnel',    // ← adjust if your tableName differs
      'balance',
      {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.00
      }
    );
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn(
      'delivery_personnel',    // ← same tableName as above
      'balance'
    );
  }
};