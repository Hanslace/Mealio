'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([

      // ── USERS ───────────────────────────────────────────────────────────
      queryInterface.addColumn('users', 'profile_photo_url', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      queryInterface.addColumn('users', 'default_address_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'addresses', key: 'address_id' },
        onDelete: 'SET NULL'
      }),
      queryInterface.addColumn('users', 'date_of_birth', {
        type: Sequelize.DATEONLY,
        allowNull: true
      }),

      // ── RESTAURANTS ────────────────────────────────────────────────────
      queryInterface.addColumn('restaurants', 'logo_url', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      queryInterface.addColumn('restaurants', 'cover_photo_url', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      queryInterface.addColumn('restaurants', 'description', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      queryInterface.addColumn('restaurants', 'cuisine_type', {
        type: Sequelize.STRING(50),
        allowNull: true
      }),
      queryInterface.addColumn('restaurants', 'website_url', {
        type: Sequelize.STRING(255),
        allowNull: true
      }),
      queryInterface.addColumn('restaurants', 'social_links', {
        type: Sequelize.JSON,
        allowNull: true
      }),

      // ── DELIVERY_PERSONNEL ─────────────────────────────────────────────
      queryInterface.addColumn('delivery_personnel', 'profile_photo_url', {
        type: Sequelize.TEXT,
        allowNull: true
      }),
      queryInterface.addColumn('delivery_personnel', 'document_urls', {
        type: Sequelize.JSON,
        allowNull: true
      }),
      queryInterface.addColumn('delivery_personnel', 'vehicle_photo_url', {
        type: Sequelize.TEXT,
        allowNull: true
      })

    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([

      // ── DELIVERY_PERSONNEL ─────────────────────────────────────────────
      queryInterface.removeColumn('delivery_personnel', 'vehicle_photo_url'),
      queryInterface.removeColumn('delivery_personnel', 'document_urls'),
      queryInterface.removeColumn('delivery_personnel', 'profile_photo_url'),

      // ── RESTAURANTS ────────────────────────────────────────────────────
      queryInterface.removeColumn('restaurants', 'social_links'),
      queryInterface.removeColumn('restaurants', 'website_url'),
      queryInterface.removeColumn('restaurants', 'cuisine_type'),
      queryInterface.removeColumn('restaurants', 'description'),
      queryInterface.removeColumn('restaurants', 'cover_photo_url'),
      queryInterface.removeColumn('restaurants', 'logo_url'),

      // ── USERS ───────────────────────────────────────────────────────────
      queryInterface.removeColumn('users', 'date_of_birth'),
      queryInterface.removeColumn('users', 'default_address_id'),
      queryInterface.removeColumn('users', 'profile_photo_url')

    ]);
  }
};
