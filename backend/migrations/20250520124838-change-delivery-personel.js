// migrations/20250521-update-delivery-null-settings.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Only enforce non-null on required signup & system fields
    await Promise.all([
      queryInterface.changeColumn('delivery_personnel', 'driver_license_no', {
        type: Sequelize.STRING(50),
        allowNull: false
      }),
      queryInterface.changeColumn('delivery_personnel', 'license_expiry_date', {
        type: Sequelize.DATE,
        allowNull: false
      }),
      queryInterface.changeColumn('delivery_personnel', 'vehicle_type', {
        type: Sequelize.STRING(50),
        allowNull: false
      }),
      queryInterface.changeColumn('delivery_personnel', 'vehicle_plate_number', {
        type: Sequelize.STRING(20),
        allowNull: false
      }),
      queryInterface.changeColumn('delivery_personnel', 'iban', {
        type: Sequelize.STRING(40),
        allowNull: false
      }),

      // System / metrics
      queryInterface.changeColumn('delivery_personnel', 'rating', {
        type: Sequelize.DECIMAL(2,1),
        allowNull: false,
        defaultValue: 0.0
      }),
      queryInterface.changeColumn('delivery_personnel', 'total_deliveries', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.changeColumn('delivery_personnel', 'acceptance_rate', {
        type: Sequelize.DECIMAL(5,2),
        allowNull: false,
        defaultValue: 0.0
      }),
      queryInterface.changeColumn('delivery_personnel', 'cancellation_rate', {
        type: Sequelize.DECIMAL(5,2),
        allowNull: false,
        defaultValue: 0.0
      }),
      queryInterface.changeColumn('delivery_personnel', 'status', {
        type: Sequelize.ENUM('active','not_active','suspended'),
        allowNull: false,
        defaultValue: 'not_active'
      }),
      queryInterface.changeColumn('delivery_personnel', 'verification_status', {
        type: Sequelize.ENUM('pending','approved','rejected'),
        allowNull: false,
        defaultValue: 'pending'
      }),
      queryInterface.changeColumn('delivery_personnel', 'is_deleted', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // Revert required signup & system fields back to nullable
    await Promise.all([
      queryInterface.changeColumn('delivery_personnel', 'driver_license_no', {
        type: Sequelize.STRING(50),
        allowNull: true
      }),
      queryInterface.changeColumn('delivery_personnel', 'license_expiry_date', {
        type: Sequelize.DATE,
        allowNull: true
      }),
      queryInterface.changeColumn('delivery_personnel', 'vehicle_type', {
        type: Sequelize.STRING(50),
        allowNull: true
      }),
      queryInterface.changeColumn('delivery_personnel', 'vehicle_plate_number', {
        type: Sequelize.STRING(20),
        allowNull: true
      }),
      queryInterface.changeColumn('delivery_personnel', 'iban', {
        type: Sequelize.STRING(40),
        allowNull: true
      }),
      queryInterface.changeColumn('delivery_personnel', 'rating', {
        type: Sequelize.DECIMAL(2,1),
        allowNull: true,
        defaultValue: 0.0
      }),
      queryInterface.changeColumn('delivery_personnel', 'total_deliveries', {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0
      }),
      queryInterface.changeColumn('delivery_personnel', 'acceptance_rate', {
        type: Sequelize.DECIMAL(5,2),
        allowNull: true,
        defaultValue: 0.0
      }),
      queryInterface.changeColumn('delivery_personnel', 'cancellation_rate', {
        type: Sequelize.DECIMAL(5,2),
        allowNull: true,
        defaultValue: 0.0
      }),
      queryInterface.changeColumn('delivery_personnel', 'status', {
        type: Sequelize.ENUM('active','not_active','suspended'),
        allowNull: true,
        defaultValue: 'not_active'
      }),
      queryInterface.changeColumn('delivery_personnel', 'verification_status', {
        type: Sequelize.ENUM('pending','approved','rejected'),
        allowNull: true,
        defaultValue: 'pending'
      }),
      queryInterface.changeColumn('delivery_personnel', 'is_deleted', {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      })
    ]);
  }
};
