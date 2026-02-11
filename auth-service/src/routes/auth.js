const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Token = require('../models/token');
const auth = require('../middleware/auth');

require('dotenv').config();

const router = express.Router();

// ---------- REGISTER ----------
router.post('/register', async (req, res) => {

  try {

    const { firstName, lastName, email, password, role, city } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ error: 'First & last name required' });
    }

    if (role === 'authority' && !city) {
      return res.status(400).json({ error: 'City required for authority' });
    }

    const exists = await User.findOne({ where: { email } });

    if (exists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashed,
      role,
      city
    });

    res.status(201).json({
      id: user.id,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- LOGIN ----------
router.post('/login', async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ accessToken, refreshToken });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------- REFRESH ----------
router.post('/refresh', async (req, res) => {

  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token required' });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const newAccess = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.json({ accessToken: newAccess });

  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// ---------- ME ----------
router.get('/me', auth(), async (req, res) => {

  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });

  res.json(user);
});

// ---------- PROFILE ----------
router.get('/profile', auth(), async (req, res) => {

  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });

  res.json({ profile: user });
});

// ---------- LOGOUT ----------
router.post('/logout', auth(), async (req, res) => {

  const decoded = jwt.decode(req.token);

  await Token.create({
    token: req.token,
    expiresAt: new Date(decoded.exp * 1000)
  });

  res.json({ message: 'Logged out successfully' });
});

// ---------- USERS (AUTHORITY) ----------
router.get('/users', auth(['authority']), async (req, res) => {

  const users = await User.findAll({
    attributes: { exclude: ['password'] }
  });

  res.json(users);
});

module.exports = router;