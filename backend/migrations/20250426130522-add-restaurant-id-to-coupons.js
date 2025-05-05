'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('coupons', 'restaurant_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'restaurants',
        key: 'restaurant_id'
      },
      onDelete: 'CASCADE'
    });

    // (Optional) If you want stricter constraints later, you can also make valid_from, valid_until not null
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('coupons', 'restaurant_id');
  }
};
