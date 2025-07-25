// Import required packages
const express = require('express');
const router = express.Router();

// Import User model to interact with user data
const User = require('../models/user.js');

// INDEX ROUTE - Display all users in the community
// GET /users
router.get('/', async (req, res) => {
  try {
    // Find all users in the database and populate their pantry data
    const users = await User.find({});
    
    // Render the community index page with all users
    res.render('users/index.ejs', {
      users: users,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/');
  }
});

// SHOW ROUTE - Display a specific user's pantry
// GET /users/:userId
router.get('/:userId', async (req, res) => {
  try {
    // Find the specific user by ID
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.redirect('/users');
    }
    
    // Render the user's show page with their pantry items
    res.render('users/show.ejs', {
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.redirect('/users');
  }
});

module.exports = router;