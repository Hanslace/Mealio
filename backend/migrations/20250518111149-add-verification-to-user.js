'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add token fields
    await queryInterface.addColumn('users', 'verification_token', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('users', 'verification_token_expires', {
      type: Sequelize.DATE,
      allowNull: true,
    });

  
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('users', 'verification_token');
    await queryInterface.removeColumn('users', 'verification_token_expires');
    // (Optional) revert is_verified default if needed
  },
};
