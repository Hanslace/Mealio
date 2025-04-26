// src/models/orderItem.model.js
module.exports = (sequelize, DataTypes) => {
    const OrderItem = sequelize.define('OrderItem', {
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      item_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      item_price_at_purchase: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
      }
    }, {
      tableName: 'order_items',
      timestamps: false
    });
  
    OrderItem.associate = (models) => {
      OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });
      OrderItem.belongsTo(models.MenuItem, { foreignKey: 'item_id' });
    };
  
    return OrderItem;
  };
  