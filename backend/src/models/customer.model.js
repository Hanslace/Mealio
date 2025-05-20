module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      references: { model: 'users', key: 'user_id' },
      onDelete: 'CASCADE'
    },
    profile_photo_url:  { type: DataTypes.TEXT,      allowNull: true },
    default_address_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: 'addresses', key: 'address_id' }
    },
    date_of_birth:      { type: DataTypes.DATEONLY,  allowNull: true },
    loyalty_points:     { type: DataTypes.INTEGER,   defaultValue: 0 },
    is_active:          { type: DataTypes.BOOLEAN,   defaultValue: true } // moved from User
  },{
    tableName: 'customers',
    timestamps: false
  });

  Customer.associate = (models) => {
    Customer.belongsTo(models.User,    { foreignKey: 'user_id', as: 'user' });
    Customer.belongsTo(models.Address, { foreignKey: 'default_address_id', as: 'defaultAddress' });
  };

  return Customer;
};