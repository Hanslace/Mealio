// migrations/20250520-migrate-customer-profile.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Create customers table (no data migration needed since tables are empty)
    await queryInterface.createTable('customers', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: { model: 'users', key: 'user_id' },
        onDelete: 'CASCADE',
        allowNull: false
      },
      profile_photo_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      default_address_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'addresses', key: 'address_id' },
        onDelete: 'SET NULL'
      },
      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      loyalty_points: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 2. Remove moved columns from users
    await Promise.all([
      queryInterface.removeColumn('users', 'profile_photo_url'),
      queryInterface.removeColumn('users', 'default_address_id'),
      queryInterface.removeColumn('users', 'date_of_birth'),
      queryInterface.removeColumn('users', 'loyalty_points'),
      queryInterface.removeColumn('users', 'is_active')
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Add columns back to users
    await Promise.all([
      queryInterface.addColumn('users', 'profile_photo_url', { type: Sequelize.TEXT, allowNull: true }),
      queryInterface.addColumn('users', 'default_address_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'addresses', key: 'address_id' },
        onDelete: 'SET NULL'
      }),
      queryInterface.addColumn('users', 'date_of_birth', { type: Sequelize.DATEONLY, allowNull: true }),
      queryInterface.addColumn('users', 'loyalty_points', { type: Sequelize.INTEGER, allowNull: false, defaultValue: 0 }),
      queryInterface.addColumn('users', 'is_active', { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true })
    ]);

    // 2. Drop customers table
    await queryInterface.dropTable('customers');
  }
};
