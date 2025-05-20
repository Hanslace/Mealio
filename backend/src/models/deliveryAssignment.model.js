// src/models/deliveryAssignment.model.js

module.exports = (sequelize, DataTypes) => {
  const DeliveryAssignment = sequelize.define('DeliveryAssignment', {
    assignment_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // ordering info
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // initially null—only set when a driver picks it up
    delivery_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    // job lifecycle
    assignment_status: {
      type: DataTypes.ENUM(
        'available',    // visible in nearby drivers’ feeds
        'assigned',     // driver clicked “accept”
        'picked_up',
        'delivering',
        'delivered',
        'failed'
      ),
      defaultValue: 'available',
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: DataTypes.DATE,

    // geolocation: pick-up + drop-off
    pickup_latitude:  { type: DataTypes.DECIMAL(9,6), allowNull: false },
    pickup_longitude: { type: DataTypes.DECIMAL(9,6), allowNull: false },
    dropoff_latitude:  { type: DataTypes.DECIMAL(9,6), allowNull: false },
    dropoff_longitude: { type: DataTypes.DECIMAL(9,6), allowNull: false },

    // brief job metrics
    distance: {               // in km or miles—your choice
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
    payout: {                 // what driver earns
      type: DataTypes.DECIMAL(10,2),
      allowNull: false,
    },
  }, {
    tableName: 'delivery_assignments',
    timestamps: false,
  });

  DeliveryAssignment.associate = (models) => {
    DeliveryAssignment.belongsTo(models.Order, {
      foreignKey: 'order_id',
      onDelete: 'CASCADE',
    });
    DeliveryAssignment.belongsTo(models.DeliveryPersonnel, {
      foreignKey: 'delivery_id',
      onDelete: 'SET NULL',  // don’t delete the assignment if the driver record vanishes
    });
    // no more LocationLog association
  };

  return DeliveryAssignment;
};
