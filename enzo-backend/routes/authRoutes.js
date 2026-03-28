const express = require('express');
const router = express.Router();

// This is the line that was missing! It imports the controller so the routes can use it.
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;