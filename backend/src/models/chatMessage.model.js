// src/models/chatMessage.model.js
module.exports = (sequelize, DataTypes) => {
    const ChatMessage = sequelize.define('ChatMessage', {
      message_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      chat_room_id: DataTypes.INTEGER,
      sender_id: DataTypes.INTEGER,
      message_text: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      is_read: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      is_deleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      sent_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'chat_messages',
      timestamps: false
    });
  
    ChatMessage.associate = (models) => {
      ChatMessage.belongsTo(models.ChatRoom, { foreignKey: 'chat_room_id' });
      ChatMessage.belongsTo(models.User, { foreignKey: 'sender_id' });
    };
  
    return ChatMessage;
  };
  