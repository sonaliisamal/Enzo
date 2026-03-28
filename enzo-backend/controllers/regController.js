const db = require('../db/connection');

exports.registerForEvent = async (req, res) => {
    try {
        const { user_id, event_id } = req.body;

        // 1. Validate Input
        if (!user_id || !event_id) {
            return res.status(400).json({ success: false, data: {}, message: "User ID and Event ID are required." });
        }

        // 2. Check if event exists and get capacity
        const [eventData] = await db.query('SELECT max_capacity FROM Events WHERE event_id = ?', [event_id]);
        if (eventData.length === 0) {
            return res.status(404).json({ success: false, data: {}, message: "Event not found." });
        }
        const maxCapacity = eventData[0].max_capacity;

        // 3. Check current registration count (Is it full?)
        const [regCount] = await db.query('SELECT COUNT(*) as total FROM Registrations WHERE event_id = ?', [event_id]);
        if (regCount[0].total >= maxCapacity) {
            return res.status(400).json({ success: false, data: {}, message: "Registration failed. The event is at full capacity." });
        }

        // 4. Insert Registration
        // Note: The composite primary key in your DB handles duplicate prevention natively.
        await db.query('INSERT INTO Registrations (user_id, event_id) VALUES (?, ?)', [user_id, event_id]);

        return res.status(200).json({ success: true, data: { user_id, event_id }, message: "Successfully registered for the event!" });

    } catch (error) {
        // Catch duplicate entry error from MySQL composite key
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, data: {}, message: "You are already registered for this event." });
        }
        // Catch foreign key error (e.g., user doesn't exist)
        if (error.code === 'ER_NO_REFERENCED_ROW_2') {
             return res.status(400).json({ success: false, data: {}, message: "Invalid User ID or Event ID." });
        }
        console.error(error);
        return res.status(500).json({ success: false, data: {}, message: "Internal server error." });
    }
};

exports.cancelRegistration = async (req, res) => {
    try {
        const { user_id, event_id } = req.body;
        const [result] = await db.query('DELETE FROM Registrations WHERE user_id = ? AND event_id = ?', [user_id, event_id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, data: {}, message: "Registration not found." });
        }

        return res.status(200).json({ success: true, data: {}, message: "Registration cancelled successfully." });
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Internal server error." });
    }
};


// 1. Check if a user is already registered (Returns true/false)
exports.checkRegistration = async (req, res) => {
    try {
        const { eventId, userId } = req.params;
        const [result] = await db.query('SELECT * FROM Registrations WHERE event_id = ? AND user_id = ?', [eventId, userId]);
        return res.status(200).json({ success: true, isRegistered: result.length > 0 });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// 2. Admin: Get all attendees for a specific event
exports.getEventAttendees = async (req, res) => {
    try {
        const { eventId } = req.params;
        const [attendees] = await db.query(`
            SELECT u.name, u.reg_number, u.phone, u.email 
            FROM Users u 
            JOIN Registrations r ON u.user_id = r.user_id 
            WHERE r.event_id = ?
        `, [eventId]);
        
        return res.status(200).json({ success: true, count: attendees.length, data: attendees });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};