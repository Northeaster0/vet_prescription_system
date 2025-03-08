const db = require('../models/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const [existingUser] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (existingUser.length > 0) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await db.query(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        res.status(201).json({ message: "User registered successfully", userId: result.insertId });
    } catch (error) {
        console.error("🚨 HATA:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (user.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user[0].password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ 
            message: "Login successful",
            token, 
            user: { id: user[0].id, name: user[0].name, email: user[0].email }
        });
    } catch (error) {
        console.error("🚨 HATA:", error);
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// Kullanıcıları listeleme
exports.getUsers = async (req, res) => {
    try {
        const [users] = await db.query("SELECT id, name, email FROM users");
        res.json(users);
    } catch (error) {
        console.error("🚨 HATA:", error);
        res.status(500).json({ message: "Error fetching users", error: error.message });
    }
};

// Kullanıcı güncelleme
exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    try {
        const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = password ? await bcrypt.hash(password, 10) : user[0].password;

        await db.query(
            "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?",
            [name || user[0].name, email || user[0].email, hashedPassword, id]
        );

        res.json({ message: "User updated successfully" });
    } catch (error) {
        console.error("🚨 HATA:", error);
        res.status(500).json({ message: "Error updating user", error: error.message });
    }
};

// Kullanıcı silme
exports.deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const [user] = await db.query("SELECT * FROM users WHERE id = ?", [id]);

        if (user.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        await db.query("DELETE FROM users WHERE id = ?", [id]);

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("🚨 HATA:", error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};