// src/models/review.model.js
module.exports = (sequelize, DataTypes) => {
    const Review = sequelize.define('Review', {
      review_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: DataTypes.INTEGER,
      restaurant_id: DataTypes.INTEGER,
      rating: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      comment: DataTypes.TEXT,
      review_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
      }
    }, {
      tableName: 'reviews',
      timestamps: false
    });
  
    Review.associate = (models) => {
      Review.belongsTo(models.User, { foreignKey: 'user_id' });
      Review.belongsTo(models.Restaurant, { foreignKey: 'restaurant_id' });
    };
  
    return Review;
  };