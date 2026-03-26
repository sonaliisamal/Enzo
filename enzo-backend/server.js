const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// 1. Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',      // Replace with your MySQL username
    password: 'password',  // Replace with your MySQL password
    database: 'enzo_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('✅ Connected to MySQL Database: enzo_db');
});

// --- 2. USER ROUTES ---

// Register User
app.post('/register', (req, res) => {
    const { username, password, role } = req.body;
    const sql = 'INSERT INTO Users (username, password, role) VALUES (?, ?, ?)';
    db.query(sql, [username, password, role], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'User registered!', userId: result.insertId });
    });
});

// Simple Login (Credential Check)
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const sql = 'SELECT * FROM Users WHERE username = ? AND password = ?';
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).send(err);
        if (results.length > 0) {
            res.send({ message: 'Login successful', user: results[0] });
        } else {
            res.status(401).send({ message: 'Invalid credentials' });
        }
    });
});

// --- 3. EVENT ROUTES ---

// Add Event (Admin)
app.post('/events', (req, res) => {
    const { title, description, eventDate } = req.body;
    const sql = 'INSERT INTO Events (title, description, eventDate) VALUES (?, ?, ?)';
    db.query(sql, [title, description, eventDate], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Event created!', eventId: result.insertId });
    });
});

// Get All Events
app.get('/events', (req, res) => {
    db.query('SELECT * FROM Events', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});

// --- 4. REGISTRATION ROUTE ---

// Join an Event
app.post('/join', (req, res) => {
    const { userId, eventId } = req.body;
    const sql = 'INSERT INTO Registrations (userId, eventId) VALUES (?, ?)';
    db.query(sql, [userId, eventId], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Successfully registered for the event!' });
    });
});

// Start Server
app.listen(3000, () => {
    console.log('🚀 Enzo Backend running on http://localhost:3000');
});