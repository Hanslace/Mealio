// migrations/20250521XXXXXX-create-payment-cards.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('payment_cards', {
      card_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'CASCADE'
      },
      card_type: {
        type: Sequelize.ENUM('visa', 'mastercard', 'amex', 'paypal', 'wallet', 'other'),
        allowNull: false
      },
      card_last4: {
        type: Sequelize.STRING(4),
        allowNull: false
      },
      card_token: {
        type: Sequelize.STRING,
        allowNull: false
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('now')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('payment_cards');
  }
};
