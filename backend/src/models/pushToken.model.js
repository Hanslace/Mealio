// src/models/PushToken.js

module.exports = (sequelize, DataTypes) => {
    const PushToken = sequelize.define('PushToken', {
      token_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      push_token: {
        type: DataTypes.STRING,
        allowNull: false,
      }
    }, {
      tableName: 'push_tokens',
      timestamps: true, // createdAt, updatedAt
    });
  
    PushToken.associate = (models) => {
      PushToken.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    };
  
    return PushToken;
  };
  