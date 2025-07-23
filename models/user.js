// Import Mongoose for MongoDB object modeling
const mongoose = require('mongoose');

// Define schema for individual food items that will be embedded in user documents
// This creates the structure for each food object in the pantry array
const foodSchema = new mongoose.Schema({
  name: {
    type: String,      // Food name must be a string
    required: true,    // Food name is mandatory - cannot be empty
  },
});

// Define schema for user documents in the database
const userSchema = new mongoose.Schema({
  username: {
    type: String,      // Username must be a string
    required: true,    // Username is mandatory for account creation
  },
  password: {
    type: String,      // Password stored as string (should be hashed in production)
    required: true,    // Password is mandatory for authentication
  },
  pantry: [foodSchema],  
});

// Create the User model from the schema
// This model provides methods like .find(), .create(), .save(), etc.
const User = mongoose.model('User', userSchema);

// Export the User model so it can be imported in other files
module.exports = User;
