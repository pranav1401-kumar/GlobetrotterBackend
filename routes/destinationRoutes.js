const express = require('express');
const router = express.Router();
const destinationController = require('../controllers/destinationController');

// Get a random destination for the game
router.get('/random', destinationController.getRandomDestination);

// Get multiple random destinations for answer options (including the correct one)
router.get('/options/:id', destinationController.getDestinationOptions);

// Get a specific destination by ID
router.get('/:id', destinationController.getDestinationById);

module.exports = router;