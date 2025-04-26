// src/models/deliveryAssignment.model.js
module.exports = (sequelize, DataTypes) => {
    const DeliveryAssignment = sequelize.define('DeliveryAssignment', {
      assignment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_id: DataTypes.INTEGER,
      delivery_id: DataTypes.INTEGER,
      assigned_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      current_status: {
        type: DataTypes.ENUM('assigned','picked_up','delivering','delivered','failed'),
        defaultValue: 'assigned'
      }
    }, {
      tableName: 'delivery_assignments',
      timestamps: false
    });
  
    DeliveryAssignment.associate = (models) => {
      DeliveryAssignment.belongsTo(models.Order, { foreignKey: 'order_id' });
      DeliveryAssignment.belongsTo(models.DeliveryPersonnel, { foreignKey: 'delivery_id' });
      DeliveryAssignment.hasMany(models.DeliveryLocationLog, {
        foreignKey: 'assignment_id',
        onDelete: 'CASCADE'
      });
    };
  
    return DeliveryAssignment;
  };
  