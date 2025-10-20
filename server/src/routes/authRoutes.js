// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, getUserByUsername, getUserByEmail } = require('../models/userModel');

const JWT_SECRET = process.env.JWT_SECRET_CODE;

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if username exists
    if (await getUserByUsername(username)) 
      return res.status(409).json({ message: `Username ${username} already registered.` });
    // Check if email exists
    if (await getUserByEmail(email)) 
      return res.status(409).json({ message: `Email ${email} already registered.` });

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await createUser(username, email, hashedPassword);


    // Create JWT token
    const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

    // Set cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 3600000,
    });

    res.status(201).json({ message: 'Registration successful' });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await getUserByUsername(username);
    if (!user)  {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
      maxAge: 3600000,
    });

    res.json({ message: 'Login successful' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
router.get('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
  });
  res.json({ message: 'Logged out' });
});


router.get("/protected", (req, res) => {

    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "No token found" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        res.json({ message: "Protected data", user: decoded.username });
    } catch (err) {
        res.status(403).json({ message: "Invalid or expired token" });
    }
});


module.exports = router;
