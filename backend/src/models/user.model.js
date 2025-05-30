module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    full_name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password_hash: { type: DataTypes.TEXT, allowNull: false },
    phone: { type: DataTypes.STRING(15) },
    role: {
      type: DataTypes.ENUM('customer','restaurant_owner','delivery_personnel','admin'),
      allowNull: false,
      defaultValue: 'customer'
    },
    is_verified: { type: DataTypes.BOOLEAN, defaultValue: false },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    last_seen:   { type: DataTypes.DATE, allowNull: true },
    password_reset_token:   { type: DataTypes.STRING, allowNull: true },
    password_reset_expires: { type: DataTypes.DATE,   allowNull: true },
    password_reset_sent_at: { type: DataTypes.DATE,   allowNull: true },
    verification_token:         { type: DataTypes.STRING, allowNull: true },
    verification_token_expires: { type: DataTypes.DATE,   allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  },{
    tableName: 'users',
    timestamps: false
  });

  User.associate = (models) => {
    User.hasMany(models.Address,    { foreignKey: 'user_id', onDelete: 'CASCADE' });
    User.hasOne(models.Restaurant, { foreignKey: 'owner_id' });
    User.hasOne(models.DeliveryPersonnel, { foreignKey: 'user_id' });
    User.hasMany(models.Order,      { foreignKey: 'user_id' });
    User.hasMany(models.Review,     { foreignKey: 'user_id' });
    User.hasMany(models.ChatRoom,   { foreignKey: 'user_one_id' });
    User.hasMany(models.ChatRoom,   { foreignKey: 'user_two_id' });
    User.hasMany(models.ChatMessage,{ foreignKey: 'sender_id' });
    User.belongsToMany(models.MenuItem, { through: 'LikedMenuItems', foreignKey: 'user_id', as: 'likedItems' });
    User.hasMany(models.MenuItemLike, { foreignKey: 'user_id' });
    User.hasMany(models.PushToken,    { foreignKey: 'user_id', as: 'pushTokens' });
    User.hasOne(models.Customer, {    foreignKey: 'user_id'    });
  };

  return User;
};