// src/models/address.model.js
module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define('Address', {
      address_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER
      },
      address_line1: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      address_line2: DataTypes.STRING(255),
      city: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      state: DataTypes.STRING(100),
      country: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      zip_code: DataTypes.STRING(20),
      latitude: DataTypes.DECIMAL(9,6),
      longitude: DataTypes.DECIMAL(9,6),
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'addresses',
      timestamps: false
    });
  
    Address.associate = (models) => {
      Address.belongsTo(models.User, {
        foreignKey: 'user_id',
        onDelete: 'CASCADE'
      });
    };
  
    return Address;
  };
  