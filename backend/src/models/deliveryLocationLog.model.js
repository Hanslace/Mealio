// src/models/deliveryLocationLog.model.js
module.exports = (sequelize, DataTypes) => {
    const DeliveryLocationLog = sequelize.define('DeliveryLocationLog', {
      location_log_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      assignment_id: DataTypes.INTEGER,
      captured_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      latitude: {
        type: DataTypes.DECIMAL(9,6),
        allowNull: false
      },
      longitude: {
        type: DataTypes.DECIMAL(9,6),
        allowNull: false
      }
    }, {
      tableName: 'delivery_location_logs',
      timestamps: false
    });
  
    DeliveryLocationLog.associate = (models) => {
      DeliveryLocationLog.belongsTo(models.DeliveryAssignment, {
        foreignKey: 'assignment_id',
        onDelete: 'CASCADE'
      });
    };
  
    return DeliveryLocationLog;
  };
  