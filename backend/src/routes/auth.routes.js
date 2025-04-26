const router = require('express').Router();
const { body } = require('express-validator');
const authController = require('../controllers/auth.controller');
const validationCheck = require('../middlewares/validationCheck.middleware');

router.post(
    '/register', 
    [
      body('full_name').notEmpty().withMessage('full_name is required'),
      body('email').isEmail().withMessage('Must be a valid email'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars')
    ],
    validationCheck,
    authController.register
  );
  
router.post('/login', authController.login);

module.exports = router;
