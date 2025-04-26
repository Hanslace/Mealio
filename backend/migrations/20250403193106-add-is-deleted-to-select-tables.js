'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // USERS
    await queryInterface.addColumn('users', 'is_deleted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    // ORDERS
    await queryInterface.addColumn('orders', 'is_deleted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });

    // CHAT_MESSAGES
    await queryInterface.addColumn('chat_messages', 'is_deleted', {
      type: Sequelize.BOOLEAN,
      defaultValue: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert the additions
    await queryInterface.removeColumn('users', 'is_deleted');
    await queryInterface.removeColumn('orders', 'is_deleted');
    await queryInterface.removeColumn('chat_messages', 'is_deleted');
  }
};
