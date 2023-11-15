const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

const Users = require('../models/Users');

router.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new Users({
      username: req.body.username,
      password: hashedPassword,
      photoLink: req.body.photo,
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
    const user = await User.findById(req.userId, { password: 0 });
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function authenticateToken(req, res, next) {
  const token = req.header('Authorization');

  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  jwt.verify(token, 'secretKey', (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });

    req.userId = user.userId;
    next();
  });
}

module.exports = router;
