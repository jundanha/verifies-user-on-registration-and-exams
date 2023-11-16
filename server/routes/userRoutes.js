const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const Users = require('../models/Users');

router.post('/register', async (req, res) => {
  try {
    const username = await Users.findOne({ username: req.body.username });
    if (username) return res.status(400).json({ error: 'Username already exists' });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // TODO: save photo into cloud
    let photoLink = req.body.photo;

    const user = new Users({
      username: req.body.username,
      password: hashedPassword,
      photoLink: photoLink,
    });

    await user.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await Users.findOne({ username: req.body.username });

    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'secretKey', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await Users.findById(req.userId, { password: 0 });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function authenticateToken(req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) {
      console.error(err);
      return res.status(403).json({ error: 'Forbidden' });
    }

    req.userId = user.userId;
    next();
  });
}

module.exports = router;
