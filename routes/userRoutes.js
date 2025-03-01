const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register a new user
router.post('/register', userController.registerUser);

// Get user by unique ID
router.get('/:id', userController.getUserById);

// Update user score
router.put('/:id/score', userController.updateUserScore);

module.exports = router;