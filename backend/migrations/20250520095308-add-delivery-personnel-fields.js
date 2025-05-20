'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([

      // KYC & vehicle
      queryInterface.addColumn('delivery_personnel', 'license_expiry_date', {
        type: Sequelize.DATE,
        allowNull: false
      }),
      queryInterface.addColumn('delivery_personnel', 'vehicle_plate_number', {
        type: Sequelize.STRING(20),
        allowNull: false
      }),

      // Payout
      queryInterface.addColumn('delivery_personnel', 'iban', {
        type: Sequelize.STRING(40),
        allowNull: false
      }),

      // Location & availability
      queryInterface.addColumn('delivery_personnel', 'current_latitude', {
        type: Sequelize.DECIMAL(9,6),
        allowNull: true
      }),
      queryInterface.addColumn('delivery_personnel', 'current_longitude', {
        type: Sequelize.DECIMAL(9,6),
        allowNull: true
      }),
      queryInterface.addColumn('delivery_personnel', 'last_location_timestamp', {
        type: Sequelize.DATE,
        allowNull: true
      }),

      // Performance metrics
      queryInterface.addColumn('delivery_personnel', 'rating', {
        type: Sequelize.DECIMAL(2,1),
        allowNull: false,
        defaultValue: 0.0
      }),
      queryInterface.addColumn('delivery_personnel', 'total_deliveries', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }),
      queryInterface.addColumn('delivery_personnel', 'acceptance_rate', {
        type: Sequelize.DECIMAL(5,2),
        allowNull: false,
        defaultValue: 0.0
      }),
      queryInterface.addColumn('delivery_personnel', 'cancellation_rate', {
        type: Sequelize.DECIMAL(5,2),
        allowNull: false,
        defaultValue: 0.0
      }),

      // Timestamps
      queryInterface.addColumn('delivery_personnel', 'updated_at', {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      })

    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('delivery_personnel', 'updated_at'),
      queryInterface.removeColumn('delivery_personnel', 'cancellation_rate'),
      queryInterface.removeColumn('delivery_personnel', 'acceptance_rate'),
      queryInterface.removeColumn('delivery_personnel', 'total_deliveries'),
      queryInterface.removeColumn('delivery_personnel', 'rating'),


      queryInterface.removeColumn('delivery_personnel', 'last_location_timestamp'),
      queryInterface.removeColumn('delivery_personnel', 'current_longitude'),
      queryInterface.removeColumn('delivery_personnel', 'current_latitude'),

      queryInterface.removeColumn('delivery_personnel', 'iban'),

      queryInterface.removeColumn('delivery_personnel', 'vehicle_plate_number'),
      queryInterface.removeColumn('delivery_personnel', 'license_expiry_date')
    ]);
  }
};
