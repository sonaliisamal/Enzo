const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getAllEvents);
router.get('/search', eventController.searchEvents);
router.post('/', eventController.createEvent); // Admin route

router.delete('/:id', eventController.deleteEvent); // Admin delete route


router.get('/:id', eventController.getEventById); 
router.put('/:id', eventController.updateEvent); // Admin update route


module.exports = router;