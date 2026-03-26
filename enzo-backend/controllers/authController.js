const db = require('../db/connection');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const userRole = role || 'user'; // Default to user

        await db.query('INSERT INTO Users (name, email, password, role) VALUES (?, ?, ?, ?)', [name, email, password, userRole]);
        return res.status(200).json({ success: true, data: { email, role: userRole }, message: "User registered successfully." });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ success: false, data: {}, message: "Email already exists." });
        }
        return res.status(500).json({ success: false, data: {}, message: "Internal server error." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.query('SELECT user_id, name, email, role FROM Users WHERE email = ? AND password = ?', [email, password]);

        if (users.length === 0) {
            return res.status(400).json({ success: false, data: {}, message: "Invalid email or password." });
        }

        return res.status(200).json({ success: true, data: users[0], message: "Login successful." });
    } catch (error) {
        return res.status(500).json({ success: false, data: {}, message: "Internal server error." });
    }
};