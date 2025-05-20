'use strict';

module.exports = {
  up: async (qi, Sequelize) => {
    // 1) Drop the unused location‐log table
    await qi.dropTable('delivery_location_logs');

    // 2) Allow delivery_id to be nullable
    await qi.changeColumn('delivery_assignments', 'delivery_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    // 3) Add created_at & updated_at if they’re not already there
    await qi.sequelize.query(`
      ALTER TABLE delivery_assignments
      ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;
    `);

    // 4) Add "available" to the existing enum type before changing the column
    await qi.sequelize.query(`
      ALTER TYPE "enum_delivery_assignments_current_status"
      ADD VALUE IF NOT EXISTS 'available';
    `);

    // 5) Expand current_status to include your new workflow
    await qi.changeColumn('delivery_assignments', 'current_status', {
      type: Sequelize.ENUM(
        'available',
        'assigned',
        'picked_up',
        'delivering',
        'delivered',
        'failed'
      ),
      allowNull: false,
      defaultValue: 'available',
    });

    // 6) Rename current_status → assignment_status
    await qi.renameColumn('delivery_assignments', 'current_status', 'assignment_status');

    // 7) Add geo + metrics fields
    await Promise.all([
      qi.addColumn('delivery_assignments', 'pickup_latitude',  { type: Sequelize.DECIMAL(9,6),  allowNull: false }),
      qi.addColumn('delivery_assignments', 'pickup_longitude', { type: Sequelize.DECIMAL(9,6),  allowNull: false }),
      qi.addColumn('delivery_assignments', 'dropoff_latitude', { type: Sequelize.DECIMAL(9,6),  allowNull: false }),
      qi.addColumn('delivery_assignments', 'dropoff_longitude',{ type: Sequelize.DECIMAL(9,6),  allowNull: false }),
      qi.addColumn('delivery_assignments', 'distance',         { type: Sequelize.DECIMAL(10,2), allowNull: false }),
      qi.addColumn('delivery_assignments', 'payout',           { type: Sequelize.DECIMAL(10,2), allowNull: false }),
    ]);

    // 8) Add "ready" to orders enum
    await qi.sequelize.query(`
      ALTER TYPE "enum_orders_order_status"
      ADD VALUE IF NOT EXISTS 'ready';
    `);

    // 9) Change order_status to include "ready"
    await qi.changeColumn('orders', 'order_status', {
      type: Sequelize.ENUM(
        'placed',
        'preparing',
        'ready',
        'out_for_delivery',
        'delivered',
        'canceled'
      ),
      allowNull: false,
      defaultValue: 'placed',
    });

    // 10) Add updated_at to orders
    await qi.sequelize.query(`
      ALTER TABLE orders
      ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE;
    `);
  },

  down: async (qi, Sequelize) => {
    // 1) Recreate the log table
    await qi.createTable('delivery_location_logs', {
      location_log_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      assignment_id:     Sequelize.INTEGER,
      captured_at:       { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
      latitude:          { type: Sequelize.DECIMAL(9,6), allowNull: false },
      longitude:         { type: Sequelize.DECIMAL(9,6), allowNull: false },
    });

    // 2) Drop geo + metrics + timestamps from assignments
    await qi.sequelize.query(`
      ALTER TABLE delivery_assignments
      DROP COLUMN IF EXISTS pickup_latitude,
      DROP COLUMN IF EXISTS pickup_longitude,
      DROP COLUMN IF EXISTS dropoff_latitude,
      DROP COLUMN IF EXISTS dropoff_longitude,
      DROP COLUMN IF EXISTS distance,
      DROP COLUMN IF EXISTS payout,
      DROP COLUMN IF EXISTS created_at,
      DROP COLUMN IF EXISTS updated_at;
    `);

    // 3) Rename assignment_status → current_status
    await qi.renameColumn('delivery_assignments', 'assignment_status', 'current_status');

    // 4) Shrink current_status back to the old enum (note: pg won't actually remove the extra value)
    await qi.changeColumn('delivery_assignments', 'current_status', {
      type: Sequelize.ENUM(
        'assigned',
        'picked_up',
        'delivering',
        'delivered',
        'failed'
      ),
      allowNull: false,
      defaultValue: 'assigned',
    });

    // 5) Make delivery_id NOT NULL again
    await qi.changeColumn('delivery_assignments', 'delivery_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    // 6) Drop updated_at on orders
    await qi.sequelize.query(`
      ALTER TABLE orders
      DROP COLUMN IF EXISTS updated_at;
    `);

    // 7) Revert orders enum back (pg will keep 'ready' but column type changes)
    await qi.changeColumn('orders', 'order_status', {
      type: Sequelize.ENUM(
        'placed',
        'accepted',
        'preparing',
        'out_for_delivery',
        'delivered',
        'canceled'
      ),
      allowNull: false,
      defaultValue: 'placed',
    });
  }
};
