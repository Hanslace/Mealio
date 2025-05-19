// routes/auth.routes.js
const router          = require('express').Router();
const { body }        = require('express-validator');
const authMiddleware  = require('../middlewares/auth.middleware');
const authController  = require('../controllers/auth.controller');
const validationCheck = require('../middlewares/validationCheck.middleware');

router.post(
  '/register',
  [
    body('full_name').notEmpty().withMessage('full_name is required'),
    body('email').isEmail().withMessage('Must be a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars'),
  ],
  validationCheck,
  authController.register
);
router.get( '/verify-email',         authCtrl.verifyEmail);
router.post('/resend-verification',  authCtrl.resendVerification);

router.post('/login', authController.login);

router.post(
  '/logout',
  authMiddleware(),
  authController.logout
);

// ─── Password reset routes ─────────────────────
router.post(
  '/forgot-password',
  [ body('email').isEmail().withMessage('Valid email is required') ],
  validationCheck,
  authController.forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword').isLength({ min: 6 }).withMessage('Password must be at least 6 chars')
  ],
  validationCheck,
  authController.resetPassword
);

router.get(
  '/verify-reset-token/:token',
  authController.verifyResetToken
);

module.exports = router;
