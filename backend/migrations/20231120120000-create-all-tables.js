'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * 1) Create Enums (if your Postgres version doesn't handle inline ENUM creation well)
     *    Some installations require you to create the enums prior to using them. 
     *    You can skip this step if inline creation in columns works fine for you.
     */
    await queryInterface.sequelize.query(`
      DO $$
      BEGIN
        -- user role enum
        IF NOT EXISTS (
          SELECT 1 
          FROM pg_type 
          WHERE typname = 'enum_users_role'
        ) THEN
          CREATE TYPE "enum_users_role" AS 
            ENUM ('customer', 'restaurant_owner', 'delivery_personnel', 'admin');
        END IF;

        -- restaurant status enum
        IF NOT EXISTS (
          SELECT 1 
          FROM pg_type 
          WHERE typname = 'enum_restaurants_status'
        ) THEN
          CREATE TYPE "enum_restaurants_status" AS 
            ENUM ('open', 'closed', 'suspended');
        END IF;

        -- delivery personnel enum
        IF NOT EXISTS (
          SELECT 1 
          FROM pg_type 
          WHERE typname = 'enum_delivery_personnel_verification_status'
        ) THEN
          CREATE TYPE "enum_delivery_personnel_verification_status" AS 
            ENUM ('pending', 'approved', 'rejected');
        END IF;

        -- coupon discount_type
        IF NOT EXISTS (
          SELECT 1 
          FROM pg_type 
          WHERE typname = 'enum_coupons_discount_type'
        ) THEN
          CREATE TYPE "enum_coupons_discount_type" AS 
            ENUM ('percentage', 'fixed');
        END IF;

        -- order_status
        IF NOT EXISTS (
          SELECT 1 
          FROM pg_type 
          WHERE typname = 'enum_orders_order_status'
        ) THEN
          CREATE TYPE "enum_orders_order_status" AS 
            ENUM ('placed','accepted','preparing','out_for_delivery','delivered','canceled');
        END IF;

        -- payment_status
        IF NOT EXISTS (
          SELECT 1 
          FROM pg_type 
          WHERE typname = 'enum_payments_payment_status'
        ) THEN
          CREATE TYPE "enum_payments_payment_status" AS 
            ENUM ('pending','completed','failed');
        END IF;

        -- payment_mode
        IF NOT EXISTS (
          SELECT 1 
          FROM pg_type 
          WHERE typname = 'enum_orders_payment_mode'
        ) THEN
          CREATE TYPE "enum_orders_payment_mode" AS 
            ENUM ('cod','card','wallet','paypal','other');
        END IF;

        -- delivery_assignment_status
        IF NOT EXISTS (
          SELECT 1 
          FROM pg_type 
          WHERE typname = 'enum_delivery_assignments_current_status'
        ) THEN
          CREATE TYPE "enum_delivery_assignments_current_status" AS 
            ENUM ('assigned','picked_up','delivering','delivered','failed');
        END IF;
      END$$;
    `);

    /**
     * 2) Create users table
     */
    await queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      full_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(15)
      },
      role: {
        type: Sequelize.ENUM('customer','restaurant_owner','delivery_personnel','admin'), 
        allowNull: false,
        defaultValue: 'customer'
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      loyalty_points: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    /**
     * 3) Create addresses table (belongsTo users)
     */
    await queryInterface.createTable('addresses', {
      address_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      address_line1: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      address_line2: {
        type: Sequelize.STRING(255)
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      state: {
        type: Sequelize.STRING(100)
      },
      country: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      zip_code: {
        type: Sequelize.STRING(20)
      },
      latitude: {
        type: Sequelize.DECIMAL(9,6)
      },
      longitude: {
        type: Sequelize.DECIMAL(9,6)
      },
      is_default: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    /**
     * 4) Create restaurants table (belongsTo users as owner_id)
     */
    await queryInterface.createTable('restaurants', {
      restaurant_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      owner_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      restaurant_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      license_number: {
        type: Sequelize.STRING(50)
      },
      address: {
        type: Sequelize.STRING(255)
      },
      latitude: {
        type: Sequelize.DECIMAL(9,6)
      },
      longitude: {
        type: Sequelize.DECIMAL(9,6)
      },
      contact_phone: {
        type: Sequelize.STRING(15)
      },
      opening_time: {
        type: Sequelize.TIME
      },
      closing_time: {
        type: Sequelize.TIME
      },
      rating: {
        type: Sequelize.DECIMAL(2,1),
        defaultValue: 0.0
      },
      status: {
        type: Sequelize.ENUM('open','closed','suspended'),
        defaultValue: 'open'
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    /**
     * 5) Create menu_items table (belongsTo restaurants)
     */
    await queryInterface.createTable('menu_items', {
      item_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'restaurants',
          key: 'restaurant_id'
        },
        onDelete: 'CASCADE'
      },
      item_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      category: {
        type: Sequelize.STRING(50)
      },
      is_available: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      image_url: {
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });

    /**
     * 6) Create coupons table
     */
    await queryInterface.createTable('coupons', {
      coupon_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      code: {
        type: Sequelize.STRING(50),
        unique: true,
        allowNull: false
      },
      discount_type: {
        type: Sequelize.ENUM('percentage','fixed'),
        allowNull: false
      },
      discount_value: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      valid_from: {
        type: Sequelize.DATEONLY
      },
      valid_until: {
        type: Sequelize.DATEONLY
      },
      usage_limit: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      times_used: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    /**
     * 7) Create orders table (belongsTo user, restaurant, address, coupon)
     */
    await queryInterface.createTable('orders', {
      order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onDelete: 'SET NULL'
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'restaurants',
          key: 'restaurant_id'
        },
        onDelete: 'SET NULL'
      },
      address_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'addresses',
          key: 'address_id'
        },
        onDelete: 'SET NULL'
      },
      coupon_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'coupons',
          key: 'coupon_id'
        },
        onDelete: 'SET NULL'
      },
      order_status: {
        type: Sequelize.ENUM('placed','accepted','preparing','out_for_delivery','delivered','canceled'),
        allowNull: false,
        defaultValue: 'placed'
      },
      placed_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      total_amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      discount_amount: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      delivery_fee: {
        type: Sequelize.DECIMAL(10,2),
        defaultValue: 0
      },
      payment_mode: {
        type: Sequelize.ENUM('cod','card','wallet','paypal','other'),
        defaultValue: 'cod'
      },
      net_amount: {
        type: Sequelize.DECIMAL(10,2)
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      updated_at: {
        type: Sequelize.DATE
      }
    });

    /**
     * 8) Create order_items table (belongsTo order, item)
     */
    await queryInterface.createTable('order_items', {
      order_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'orders',
          key: 'order_id'
        },
        onDelete: 'CASCADE'
      },
      item_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        references: {
          model: 'menu_items',
          key: 'item_id'
        },
        onDelete: 'RESTRICT'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      item_price_at_purchase: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      }
    });

    /**
     * 9) Create payments table (belongsTo orders)
     */
    await queryInterface.createTable('payments', {
      payment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'orders',
          key: 'order_id'
        },
        onDelete: 'CASCADE'
      },
      amount_paid: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false
      },
      payment_method: {
        type: Sequelize.STRING(50)
      },
      payment_status: {
        type: Sequelize.ENUM('pending','completed','failed'),
        defaultValue: 'pending'
      },
      transaction_id: {
        type: Sequelize.TEXT
      },
      transaction_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    /**
     * 10) Create reviews table (belongsTo user, restaurant)
     */
    await queryInterface.createTable('reviews', {
      review_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      restaurant_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'restaurants',
          key: 'restaurant_id'
        },
        onDelete: 'CASCADE'
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      comment: {
        type: Sequelize.TEXT
      },
      review_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    /**
     * 11) Create delivery_personnel table (belongsTo user)
     */
    await queryInterface.createTable('delivery_personnel', {
      delivery_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
        type: Sequelize.INTEGER,
        unique: true,
        references: {
          model: 'users',
          key: 'user_id'
        }
      },
      driver_license_no: {
        type: Sequelize.STRING(50)
      },
      vehicle_type: {
        type: Sequelize.STRING(50)
      },
      verification_status: {
        type: Sequelize.ENUM('pending','approved','rejected'),
        defaultValue: 'pending'
      },
      is_deleted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    /**
     * 12) Create delivery_assignments table (belongsTo order, delivery_personnel)
     */
    await queryInterface.createTable('delivery_assignments', {
      assignment_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      order_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'orders',
          key: 'order_id'
        },
        onDelete: 'CASCADE'
      },
      delivery_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'delivery_personnel',
          key: 'delivery_id'
        },
        onDelete: 'SET NULL'
      },
      assigned_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      current_status: {
        type: Sequelize.ENUM('assigned','picked_up','delivering','delivered','failed'),
        defaultValue: 'assigned'
      }
    });

    /**
     * 13) Create delivery_location_logs table (belongsTo delivery_assignments)
     */
    await queryInterface.createTable('delivery_location_logs', {
      location_log_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      assignment_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'delivery_assignments',
          key: 'assignment_id'
        },
        onDelete: 'CASCADE'
      },
      captured_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      },
      latitude: {
        type: Sequelize.DECIMAL(9,6),
        allowNull: false
      },
      longitude: {
        type: Sequelize.DECIMAL(9,6),
        allowNull: false
      }
    });

    /**
     * 14) Create chat_rooms table (self-join belongsTo user for user_one_id/user_two_id)
     */
    await queryInterface.createTable('chat_rooms', {
      chat_room_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_one_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      user_two_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });

    /**
     * 15) Create chat_messages table (belongsTo chat_rooms and user)
     */
    await queryInterface.createTable('chat_messages', {
      message_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      chat_room_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'chat_rooms',
          key: 'chat_room_id'
        },
        onDelete: 'CASCADE'
      },
      sender_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'user_id'
        },
        onDelete: 'CASCADE'
      },
      message_text: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      sent_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn('NOW')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Drop tables in reverse order to avoid foreign key conflicts
    await queryInterface.dropTable('chat_messages');
    await queryInterface.dropTable('chat_rooms');
    await queryInterface.dropTable('delivery_location_logs');
    await queryInterface.dropTable('delivery_assignments');
    await queryInterface.dropTable('delivery_personnel');
    await queryInterface.dropTable('reviews');
    await queryInterface.dropTable('payments');
    await queryInterface.dropTable('order_items');
    await queryInterface.dropTable('orders');
    await queryInterface.dropTable('coupons');
    await queryInterface.dropTable('menu_items');
    await queryInterface.dropTable('restaurants');
    await queryInterface.dropTable('addresses');
    await queryInterface.dropTable('users');

    /**
     * (Optional) Drop the enums if needed. Some setups might require manually removing them.
     * But only do so if you're sure no other migrations or tables use them.
     */
    await queryInterface.sequelize.query(`
      DROP TYPE IF EXISTS "enum_users_role";
      DROP TYPE IF EXISTS "enum_restaurants_status";
      DROP TYPE IF EXISTS "enum_delivery_personnel_verification_status";
      DROP TYPE IF EXISTS "enum_coupons_discount_type";
      DROP TYPE IF EXISTS "enum_orders_order_status";
      DROP TYPE IF EXISTS "enum_payments_payment_status";
      DROP TYPE IF EXISTS "enum_orders_payment_mode";
      DROP TYPE IF EXISTS "enum_delivery_assignments_current_status";
    `);
  }
};
