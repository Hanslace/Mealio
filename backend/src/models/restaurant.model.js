// src/models/restaurant.model.js
module.exports = (sequelize, DataTypes) => {
  const Restaurant = sequelize.define('Restaurant', {
    restaurant_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    owner_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    // Link to Address table rather than inline address fields
    address_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'addresses', key: 'address_id' },
      onDelete: 'CASCADE'
    },
    restaurant_name: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    license_number: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    contact_phone: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    cuisine_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    opening_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    closing_time: {
      type: DataTypes.TIME,
      allowNull: false
    },
    // Optional metadata
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    website_url: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    social_links: {
      type: DataTypes.JSON,
      allowNull: true
    },
    logo_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cover_photo_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    // System fields
    rating: {
      type: DataTypes.DECIMAL(2,1),
      allowNull: false,
      defaultValue: 0.0
    },
    status: {
      type: DataTypes.ENUM('open','closed','suspended'),
      allowNull: false,
      defaultValue: 'closed'
    },
    verification_status: {
      type: DataTypes.ENUM('pending','approved','rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'restaurants',
    timestamps: false
  });

  Restaurant.associate = (models) => {
    Restaurant.belongsTo(models.User,    { foreignKey: 'owner_id' });
    Restaurant.belongsTo(models.Address, { foreignKey: 'address_id', as: 'address' });
    Restaurant.hasMany(models.MenuItem,  { foreignKey: 'restaurant_id', onDelete: 'CASCADE' });
    Restaurant.hasMany(models.Order,     { foreignKey: 'restaurant_id' });
    Restaurant.hasMany(models.Review,    { foreignKey: 'restaurant_id' });
  };

  return Restaurant;
};