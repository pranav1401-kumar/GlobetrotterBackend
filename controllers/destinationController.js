const fs = require('fs');
const path = require('path');

// Load destinations from JSON file
const destinations = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/destinations.json'), 'utf8')
);

// Get a random destination for the game
exports.getRandomDestination = (req, res) => {
  try {
    // Select a random destination
    const randomIndex = Math.floor(Math.random() * destinations.length);
    const destination = destinations[randomIndex];
    
    // Only send clues, not the answer
    const responseData = {
      id: destination.id,
      clues: destination.clues,
    };
    
    res.json(responseData);
  } catch (error) {
    console.error('Error fetching random destination:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a specific destination by ID
exports.getDestinationById = (req, res) => {
  try {
    const { id } = req.params;
    const destination = destinations.find(dest => dest.id === id);
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    res.json(destination);
  } catch (error) {
    console.error('Error fetching destination:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get multiple random destinations for answer options (including the correct one)
exports.getDestinationOptions = (req, res) => {
  try {
    const { id } = req.params;
    const correctDestination = destinations.find(dest => dest.id === id);
    
    if (!correctDestination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    // Get a list of other destinations (excluding the correct one)
    const otherDestinations = destinations.filter(dest => dest.id !== id);
    
    // Select 3 random destinations as incorrect options
    const shuffled = otherDestinations.sort(() => 0.5 - Math.random());
    const incorrectOptions = shuffled.slice(0, 3);
    
    // Combine correct answer with incorrect options
    let options = [
      { id: correctDestination.id, city: correctDestination.city, country: correctDestination.country }
    ];
    
    incorrectOptions.forEach(option => {
      options.push({ id: option.id, city: option.city, country: option.country });
    });
    
    // Shuffle the options
    options = options.sort(() => 0.5 - Math.random());
    
    res.json({ options });
  } catch (error) {
    console.error('Error fetching destination options:', error);
    res.status(500).json({ message: 'Server error' });
  }
};