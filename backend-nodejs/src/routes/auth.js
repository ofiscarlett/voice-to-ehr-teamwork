const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  // TODO: Implement login logic
  res.json({ message: 'Login endpoint' });
});

router.post('/register', (req, res) => {
  // TODO: Implement registration logic
  res.json({ message: 'Register endpoint' });
});

module.exports = router; 