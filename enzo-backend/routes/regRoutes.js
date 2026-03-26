const express = require('express');
const router = express.Router();
const regController = require('../controllers/regController');

router.post('/register', regController.registerForEvent);
router.delete('/cancel', regController.cancelRegistration);

module.exports = router;