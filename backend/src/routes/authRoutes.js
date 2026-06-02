const express = require('express');

const router = express.Router();

const rateLimiter = require('../middleware/rateLimiter');

const {
 register,
 login
} = require('../controllers/authController');

// Allow 5 login attempts per minute
router.post('/login', rateLimiter(5, 60), login);

router.post('/register', register);

module.exports = router;
