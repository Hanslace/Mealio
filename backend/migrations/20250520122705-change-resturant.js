// migrations/20250520-add-addressid-to-restaurants.js
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1. Add address_id column
    await queryInterface.addColumn('restaurants', 'address_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: 'addresses', key: 'address_id' },
      onDelete: 'CASCADE'
    });

    // 2. Create foreign key constraint
    // (handled by addColumn with references)

    // 3. Remove old inline address fields
    await Promise.all([
      queryInterface.removeColumn('restaurants', 'address'),
      queryInterface.removeColumn('restaurants', 'latitude'),
      queryInterface.removeColumn('restaurants', 'longitude')
    ]);

    // 4. Alter allowNull settings for existing columns
    await Promise.all([
      queryInterface.changeColumn('restaurants', 'license_number', {
        type: Sequelize.STRING(50),
        allowNull: false
      }),
      queryInterface.changeColumn('restaurants', 'contact_phone', {
        type: Sequelize.STRING(15),
        allowNull: false
      }),
      queryInterface.changeColumn('restaurants', 'cuisine_type', {
        type: Sequelize.STRING(50),
        allowNull: false
      }),
      queryInterface.changeColumn('restaurants', 'opening_time', {
        type: Sequelize.TIME,
        allowNull: false
      }),
      queryInterface.changeColumn('restaurants', 'closing_time', {
        type: Sequelize.TIME,
        allowNull: false
      })
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // 1. Re-add old inline address fields
    await Promise.all([
      queryInterface.addColumn('restaurants', 'address', {
        type: Sequelize.STRING(255),
        allowNull: true
      }),
      queryInterface.addColumn('restaurants', 'latitude', {
        type: Sequelize.DECIMAL(9,6),
        allowNull: true
      }),
      queryInterface.addColumn('restaurants', 'longitude', {
        type: Sequelize.DECIMAL(9,6),
        allowNull: true
      })
    ]);

    // 2. Remove address_id column
    await queryInterface.removeColumn('restaurants', 'address_id');

    // 3. Revert allowNull changes
    await Promise.all([
      queryInterface.changeColumn('restaurants', 'license_number', {
        type: Sequelize.STRING(50),
        allowNull: true
      }),
      queryInterface.changeColumn('restaurants', 'contact_phone', {
        type: Sequelize.STRING(15),
        allowNull: true
      }),
      queryInterface.changeColumn('restaurants', 'cuisine_type', {
        type: Sequelize.STRING(50),
        allowNull: true
      }),
      queryInterface.changeColumn('restaurants', 'opening_time', {
        type: Sequelize.TIME,
        allowNull: true
      }),
      queryInterface.changeColumn('restaurants', 'closing_time', {
        type: Sequelize.TIME,
        allowNull: true
      })
    ]);
  }
};
