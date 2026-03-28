const db = require('../db/connection');

exports.getAllEvents = async (req, res) => {
    try {
        const [events] = await db.query('SELECT * FROM Events');
        return res.status(200).json({ success: true, data: events });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

exports.searchEvents = async (req, res) => {
    try {
        const { q } = req.query;
        const [events] = await db.query('SELECT * FROM Events WHERE name LIKE ?', [`%${q}%`]);
        return res.status(200).json({ success: true, data: events });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

exports.getEventById = async (req, res) => {
    try {
        const { id } = req.params;
        const [event] = await db.query('SELECT * FROM Events WHERE event_id = ?', [id]);
        if (event.length === 0) return res.status(404).json({ success: false, message: "Event not found." });
        return res.status(200).json({ success: true, data: event[0] });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

exports.createEvent = async (req, res) => {
    try {
        const { name, date, theme, max_capacity, start_time, end_time, description } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;
        
        const [result] = await db.query(
            'INSERT INTO Events (name, date, theme, max_capacity, start_time, end_time, description, image_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [name, date, theme, max_capacity, start_time, end_time, description, image_url]
        );

        return res.status(200).json({ success: true, message: "Event created successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to create event." });
    }
};

exports.updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, date, theme, max_capacity, start_time, end_time, description } = req.body;
        const image_url = req.file ? `/uploads/${req.file.filename}` : null;
        
        // If they uploaded a new image, update it. Otherwise, leave the old image alone.
        if (image_url) {
            await db.query(
                'UPDATE Events SET name=?, date=?, theme=?, max_capacity=?, start_time=?, end_time=?, description=?, image_url=? WHERE event_id=?',
                [name, date, theme, max_capacity, start_time, end_time, description, image_url, id]
            );
        } else {
            await db.query(
                'UPDATE Events SET name=?, date=?, theme=?, max_capacity=?, start_time=?, end_time=?, description=? WHERE event_id=?',
                [name, date, theme, max_capacity, start_time, end_time, description, id]
            );
        }
        return res.status(200).json({ success: true, message: "Event updated successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to update event." });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM Events WHERE event_id = ?', [id]);
        return res.status(200).json({ success: true, message: "Event deleted." });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to delete event." });
    }
};