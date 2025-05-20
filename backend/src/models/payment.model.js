// src/models/payment.model.js
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define('Payment', {
      payment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_id: DataTypes.INTEGER,
      amount_paid: {
        type: DataTypes.DECIMAL(10,2),
        allowNull: false
      },
      payment_method: DataTypes.STRING(50),
      payment_status: {
        type: DataTypes.ENUM('pending','completed','failed'),
        defaultValue: 'pending'
      },
      transaction_id: DataTypes.TEXT,
      transaction_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'payments',
      timestamps: false
    });
  
    Payment.associate = (models) => {
      Payment.belongsTo(models.Order, { foreignKey: 'order_id' });
    };
  
    return Payment;
  };
  