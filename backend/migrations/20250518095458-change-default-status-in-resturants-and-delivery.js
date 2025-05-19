'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // delivery_personnel.status → default NOT_ACTIVE
    await queryInterface.changeColumn('delivery_personnel', 'status', {
      type: Sequelize.ENUM('active','not_active','suspended'),
      allowNull: false,
      defaultValue: 'not_active',
    });

    // restaurants.status → default CLOSED
    await queryInterface.changeColumn('restaurants', 'status', {
      type: Sequelize.ENUM('open','closed','suspended'),
      allowNull: false,
      defaultValue: 'closed',
    });
  },

  down: async (queryInterface, Sequelize) => {
    // revert delivery_personnel.status → default ACTIVE
    await queryInterface.changeColumn('delivery_personnel', 'status', {
      type: Sequelize.ENUM('active','not_active','suspended'),
      allowNull: false,
      defaultValue: 'active',
    });

    // revert restaurants.status → default OPEN
    await queryInterface.changeColumn('restaurants', 'status', {
      type: Sequelize.ENUM('open','closed','suspended'),
      allowNull: false,
      defaultValue: 'open',
    });
  }
};
