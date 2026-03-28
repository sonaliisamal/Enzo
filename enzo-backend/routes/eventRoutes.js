const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const multer = require('multer');
const fs = require('fs'); // NEW: Import File System module

// NEW: Check if 'uploads' folder exists, if not, create it automatically!
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure Multer to save files to the 'uploads' folder
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage: storage });

// ... the rest of your routes stay exactly the same below this point ...

router.get('/', eventController.getAllEvents);
router.get('/search', eventController.searchEvents);
router.get('/:id', eventController.getEventById); 
router.delete('/:id', eventController.deleteEvent); 

// IMPORTANT: Add the upload middleware to the POST route
router.post('/', upload.single('image'), eventController.createEvent); 
router.put('/:id', upload.single('image'), eventController.updateEvent); 

module.exports = router;