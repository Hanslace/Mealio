// src/models/deliveryPersonnel.model.js
module.exports = (sequelize, DataTypes) => {
    const DeliveryPersonnel = sequelize.define('DeliveryPersonnel', {
      delivery_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        unique: true
      },
      driver_license_no: DataTypes.STRING(50),
      vehicle_type: DataTypes.STRING(50),
      status: {
        type: DataTypes.ENUM('active','not_active','suspended'),
        allowNull: false,
        defaultValue: 'not_active'
      },
      verification_status: {
        type: DataTypes.ENUM('pending','approved','rejected'),
        defaultValue: 'pending'
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'delivery_personnel',
      timestamps: false
    });
  
    DeliveryPersonnel.associate = (models) => {
      DeliveryPersonnel.belongsTo(models.User, { 
        foreignKey: 'user_id',
        as: 'User'
      });
      DeliveryPersonnel.hasMany(models.DeliveryAssignment, {
        foreignKey: 'delivery_id'
      });
    };
  
    return DeliveryPersonnel;
  };
  