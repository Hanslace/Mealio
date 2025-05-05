module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    coupon_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    restaurant_id: {               // 👈 NEW
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false
    },
    discount_type: {
      type: DataTypes.ENUM('percentage', 'fixed'),
      allowNull: false
    },
    discount_value: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    valid_from: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    valid_until: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    usage_limit: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    times_used: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'coupons',
    timestamps: false
  });

  Coupon.associate = (models) => {
    Coupon.belongsTo(models.Restaurant, {
      foreignKey: 'restaurant_id',
      onDelete: 'CASCADE'
    });
    Coupon.hasMany(models.Order, {
      foreignKey: 'coupon_id'
    });
  };

  return Coupon;
};
