const express = require('express');
const router = express.Router();
const regController = require('../controllers/regController');

router.post('/register', regController.registerForEvent);
router.delete('/cancel', regController.cancelRegistration);
// Add these below your existing routes
router.get('/check/:eventId/:userId', regController.checkRegistration);
router.get('/event/:eventId/attendees', regController.getEventAttendees);

module.exports = router;