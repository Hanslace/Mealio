// src/models/chatRoom.model.js
module.exports = (sequelize, DataTypes) => {
    const ChatRoom = sequelize.define('ChatRoom', {
      chat_room_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_one_id: DataTypes.INTEGER, 
      user_two_id: DataTypes.INTEGER,
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'chat_rooms',
      timestamps: false
    });
  
    ChatRoom.associate = (models) => {
      ChatRoom.belongsTo(models.User, { foreignKey: 'user_one_id' });
      ChatRoom.belongsTo(models.User, { foreignKey: 'user_two_id' });
      ChatRoom.hasMany(models.ChatMessage, {
        foreignKey: 'chat_room_id',
        onDelete: 'CASCADE'
      });
    };
  
    return ChatRoom;
  };
  