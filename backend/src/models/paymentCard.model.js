// src/models/paymentCard.model.js
module.exports = (sequelize, DataTypes) => {
  const PaymentCard = sequelize.define('PaymentCard', {
    card_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    card_type: {
      type: DataTypes.ENUM('visa', 'mastercard', 'amex', 'paypal', 'wallet', 'other'),
      allowNull: false
    },

    card_last4: {
      type: DataTypes.STRING(4),
      allowNull: false
    },

    card_token: {
      type: DataTypes.STRING, // tokenized value from Stripe/etc
      allowNull: false
    },

    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },

    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'payment_cards',
    timestamps: false
  });

  PaymentCard.associate = (models) => {
    PaymentCard.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE'
    });
  };

  return PaymentCard;
};
