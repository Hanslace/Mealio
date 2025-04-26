// src/models/menuItem.model.js
module.exports = (sequelize, DataTypes) => {
    const MenuItem = sequelize.define('MenuItem', {
      item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      restaurant_id: DataTypes.INTEGER,
      item_name: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      description: DataTypes.TEXT,
      price: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
      },
      category: DataTypes.STRING(50),
      is_available: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      image_url: DataTypes.TEXT,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: DataTypes.DATE
    }, {
      tableName: 'menu_items',
      timestamps: false
    });
  
    MenuItem.associate = (models) => {
      MenuItem.belongsTo(models.Restaurant, {
        foreignKey: 'restaurant_id',
        onDelete: 'CASCADE'
      });
      // Might have many orderItems, but the link is in orderItem
      MenuItem.hasMany(models.OrderItem, {
        foreignKey: 'item_id'
      });
      MenuItem.hasMany(models.MenuItemLike, { foreignKey: 'item_id' });

    };
  
    return MenuItem;
  };
  