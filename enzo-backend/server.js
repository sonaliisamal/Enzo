const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing JSON requests

// Import Routes
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const regRoutes = require('./routes/regRoutes');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/registrations', regRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 ENZO Server running on port ${PORT}`);
});

// Middleware
app.use(cors());
app.use(express.json()); // Allows parsing JSON requests
app.use('/uploads', express.static('uploads')); // <-- This belongs here!