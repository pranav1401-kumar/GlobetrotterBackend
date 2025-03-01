const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Simple in-memory storage for users (in a real app, this would be a database)
let users = [];

// Try to load existing users if the file exists
try {
  const usersFilePath = path.join(__dirname, '../data/users.json');
  
  if (fs.existsSync(usersFilePath)) {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    users = JSON.parse(data);
  } else {
    // Create the file if it doesn't exist
    fs.writeFileSync(usersFilePath, JSON.stringify(users), 'utf8');
  }
} catch (error) {
  console.error('Error loading users:', error);
}

// Save users to file
const saveUsers = () => {
  try {
    const usersFilePath = path.join(__dirname, '../data/users.json');
    fs.writeFileSync(usersFilePath, JSON.stringify(users), 'utf8');
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

// Register a new user
exports.registerUser = (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }
    
    // Check if username already exists
    const existingUser = users.find(user => user.username === username);
    
    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' });
    }
    
    // Create new user
    const newUser = {
      id: uuidv4(),
      username,
      score: {
        correct: 0,
        incorrect: 0
      },
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    saveUsers();
    
    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = (req, res) => {
  try {
    const { id } = req.params;
    const user = users.find(user => user.id === id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user score
exports.updateUserScore = (req, res) => {
  try {
    const { id } = req.params;
    const { isCorrect } = req.body;
    
    if (isCorrect === undefined) {
      return res.status(400).json({ message: 'isCorrect field is required' });
    }
    
    const userIndex = users.findIndex(user => user.id === id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update the correct or incorrect score
    if (isCorrect) {
      users[userIndex].score.correct += 1;
    } else {
      users[userIndex].score.incorrect += 1;
    }
    
    saveUsers();
    
    res.json(users[userIndex]);
  } catch (error) {
    console.error('Error updating user score:', error);
    res.status(500).json({ message: 'Server error' });
  }
};