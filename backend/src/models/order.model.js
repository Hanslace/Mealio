// src/models/order.model.js
module.exports = (sequelize, DataTypes) => {
    const Order = sequelize.define('Order', {
      order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: DataTypes.INTEGER,
      restaurant_id: DataTypes.INTEGER,
      address_id: DataTypes.INTEGER,
      coupon_id: DataTypes.INTEGER,
      order_status: {
        type: DataTypes.ENUM('placed','accepted','preparing','out_for_delivery','delivered','canceled'),
        allowNull: false,
        defaultValue: 'placed'
      },
      placed_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      total_amount: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
      },
      discount_amount: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0
      },
      delivery_fee: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0
      },
      payment_mode: {
        type: DataTypes.ENUM('cod','card','wallet','paypal','other'),
        defaultValue: 'cod'
      },
      net_amount: {
        type: DataTypes.DECIMAL(10,2)
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      },
      updated_at: DataTypes.DATE
    }, {
      tableName: 'orders',
      timestamps: false
    });
  
    Order.associate = (models) => {
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
      Order.belongsTo(models.Restaurant, { foreignKey: 'restaurant_id' });
      Order.belongsTo(models.Address, { foreignKey: 'address_id' });
      Order.belongsTo(models.Coupon, { foreignKey: 'coupon_id' });
      Order.hasMany(models.OrderItem, {
        foreignKey: 'order_id',
        onDelete: 'CASCADE'
      });
      Order.hasMany(models.Payment, {
        foreignKey: 'order_id',
        onDelete: 'CASCADE'
      });
      Order.hasOne(models.DeliveryAssignment, {
        foreignKey: 'order_id',
        onDelete: 'CASCADE'
      });
    };
  
    return Order;
  };
  