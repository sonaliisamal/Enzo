const db = require('../db/connection');

// Get all events
exports.getAllEvents = async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM Events');
        return res.status(200).json({ success: true, data: events, message: "Events fetched successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Internal server error." });
    }
};

// Search events by name
exports.searchEvents = async (req, res) => {
    try {
        const { q } = req.query; // e.g., /api/events/search?q=tech
        const [events] = await db.query('SELECT * FROM Events WHERE name LIKE ?', [`%${q}%`]);
        return res.status(200).json({ success: true, data: events, message: "Search complete." });
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Internal server error." });
    }
};

// Admin: Create Event
exports.createEvent = async (req, res) => {
    try {
        const { name, date, theme, max_capacity, start_time, end_time, description } = req.body;
        
        const [result] = await db.query(
            'INSERT INTO Events (name, date, theme, max_capacity, start_time, end_time, description) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, date, theme, max_capacity, start_time, end_time, description]
        );

        return res.status(200).json({ success: true, data: { event_id: result.insertId }, message: "Event created successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Failed to create event." });
    }
};