// src/models/deliveryPersonnel.model.js
module.exports = (sequelize, DataTypes) => {
  const DeliveryPersonnel = sequelize.define('DeliveryPersonnel', {
    delivery_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    // Foreign key to User (set during core signup)
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true
    },

    // ── REQUIRED AT DELIVERY SIGN-UP ────────────────────────────────
    driver_license_no: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    license_expiry_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    vehicle_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    vehicle_plate_number: {
      type: DataTypes.STRING(20),
      allowNull: false
    },
    iban: {
      type: DataTypes.STRING(40),
      allowNull: false
    },

    // ── OPTIONAL / PROFILE EDITABLE LATER ───────────────────────────
    current_latitude: {
      type: DataTypes.DECIMAL(9,6),
      allowNull: true
    },
    current_longitude: {
      type: DataTypes.DECIMAL(9,6),
      allowNull: true
    },
    last_location_timestamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    profile_photo_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    document_urls: {
      type: DataTypes.JSON,
      allowNull: true
    },
    vehicle_photo_url: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    // ── SYSTEM / METRICS ────────────────────────────────────────────
    rating: {
      type: DataTypes.DECIMAL(2,1),
      allowNull: false,
      defaultValue: 0.0
    },
    total_deliveries: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    acceptance_rate: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 0.0
    },
    cancellation_rate: {
      type: DataTypes.DECIMAL(5,2),
      allowNull: false,
      defaultValue: 0.0
    },
    status: {
      type: DataTypes.ENUM('active','not_active','suspended'),
      allowNull: false,
      defaultValue: 'not_active'
    },
    verification_status: {
      type: DataTypes.ENUM('pending','approved','rejected'),
      allowNull: false,
      defaultValue: 'pending'
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },

    // ── TIMESTAMPS ─────────────────────────────────────────────────
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'delivery_personnel',
    timestamps: false
  });

  DeliveryPersonnel.associate = (models) => {
    DeliveryPersonnel.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'User'
    });
    DeliveryPersonnel.hasMany(models.DeliveryAssignment, {
      foreignKey: 'delivery_id'
    });
  };

  return DeliveryPersonnel;
};
