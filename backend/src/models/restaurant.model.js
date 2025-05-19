// src/models/restaurant.model.js
module.exports = (sequelize, DataTypes) => {
    const Restaurant = sequelize.define('Restaurant', {
      restaurant_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      owner_id: DataTypes.INTEGER,
      restaurant_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      license_number: DataTypes.STRING(50),
      address: DataTypes.STRING(255),
      latitude: DataTypes.DECIMAL(9,6),
      longitude: DataTypes.DECIMAL(9,6),
      contact_phone: DataTypes.STRING(15),
      opening_time: DataTypes.TIME,
      closing_time: DataTypes.TIME,
      rating: {
        type: DataTypes.DECIMAL(2,1),
        defaultValue: 0.0
      },
      status: {
        type: DataTypes.ENUM('open','closed','suspended'),
        defaultValue: 'closed'
      },
      verification_status: {
        type: DataTypes.ENUM('pending','approved','rejected'),
        allowNull: false,
        defaultValue: 'pending'
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      created_at: DataTypes.DATE,
      updated_at: DataTypes.DATE
    }, {
      tableName: 'restaurants',
      timestamps: false
    });
  
    Restaurant.associate = (models) => {
      Restaurant.belongsTo(models.User, { foreignKey: 'owner_id' });
      Restaurant.hasMany(models.MenuItem, {
        foreignKey: 'restaurant_id',
        onDelete: 'CASCADE'
      });
      Restaurant.hasMany(models.Order, {
        foreignKey: 'restaurant_id'
      });
      Restaurant.hasMany(models.Review, {
        foreignKey: 'restaurant_id'
      });
    };
  
    return Restaurant;
  };
  