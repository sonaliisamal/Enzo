const db = require('../db/connection');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role, phone, reg_number } = req.body;
        const userRole = role || 'user'; 

        await db.query(
            'INSERT INTO Users (name, email, password, role, phone, reg_number) VALUES (?, ?, ?, ?, ?, ?)', 
            [name, email, password, userRole, phone, reg_number]
        );
        return res.status(200).json({ success: true, message: "User registered successfully." });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: "Email already exists." });
        return res.status(500).json({ success: false, message: "Internal server error." });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const [users] = await db.query('SELECT * FROM Users WHERE email = ?', [email]);
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        const user = users[0];

        if (password !== user.password) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }

        return res.status(200).json({ 
            success: true, 
            message: "Login successful.",
            data: {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Server error." });
    }
};