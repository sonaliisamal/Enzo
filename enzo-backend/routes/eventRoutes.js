const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getAllEvents);
router.get('/search', eventController.searchEvents);
router.post('/', eventController.createEvent); // Admin route

module.exports = router;