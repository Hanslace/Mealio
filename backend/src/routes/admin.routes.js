// src/routes/admin.routes.js
const router = require('express').Router();
const authMiddleware = require('../middlewares/auth.middleware');
const roleMiddleware = require('../middlewares/role.middleware');
const adminController = require('../controllers/admin.controller');

// All admin routes require user to be admin
router.use(authMiddleware(), roleMiddleware(['admin']));

// GET metrics
router.get('/dashboard', adminController.getDashboardMetrics);

// Manage users
router.get('/users', adminController.listUsers);
router.put('/users/:userId/ban', adminController.banUser);
router.put('/users/:userId/reactivate', adminController.reactivateUser);

module.exports = router;
