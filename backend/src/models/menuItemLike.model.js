module.exports = (sequelize, DataTypes) => {
    const MenuItemLike = sequelize.define('MenuItemLike', {
      like_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: DataTypes.INTEGER,
      item_id: DataTypes.INTEGER,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'menu_item_likes',
      timestamps: false
    });
  
    MenuItemLike.associate = (models) => {
      MenuItemLike.belongsTo(models.User, { foreignKey: 'user_id' });
      MenuItemLike.belongsTo(models.MenuItem, { foreignKey: 'item_id' });
    };
  
    return MenuItemLike;
  };
  