module.exports = (sequelize, DataTypes) => {
    const Notification = sequelize.define('Notification', {
      notification_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      body: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      type: {
        type: DataTypes.STRING(50),
        defaultValue: 'general'
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      sent_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'notifications',
      timestamps: false
    });
  
    Notification.associate = (models) => {
      Notification.belongsTo(models.User, {
        foreignKey: 'user_id'
      });
    };
  
    return Notification;
  };
  