const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  // TODO: Implement get all patients
  res.json({ message: 'Get all patients endpoint' });
});

router.get('/:id', (req, res) => {
  // TODO: Implement get patient by id
  res.json({ message: 'Get patient by id endpoint' });
});

router.post('/', (req, res) => {
  // TODO: Implement create patient
  res.json({ message: 'Create patient endpoint' });
});

module.exports = router; 