// Load environment variables from .env file (API keys, database URLs, etc.)
const dotenv = require('dotenv');
dotenv.config(); // Must be called early to load environment variables

// Import required packages for the Express application
const express = require('express');              // Web framework for Node.js
const app = express();                          // Create Express application instance
const mongoose = require('mongoose');           // MongoDB object modeling library
const methodOverride = require('method-override'); // Allows HTML forms to use PUT/DELETE methods
const morgan = require('morgan');               // HTTP request logger middleware
const session = require('express-session');    // Session management for user authentication

// Import route controllers to handle different sections of the app
const authController = require('./controllers/auth.js');   // Handles sign-up, sign-in, sign-out
const foodsController = require('./controllers/foods.js'); // Handles pantry CRUD operations

// Import custom middleware functions
const isSignedIn = require('./middleware/is-signed-in.js');           // Protects routes requiring authentication
const passUserToView = require('./middleware/pass-user-to-view.js');  // Makes user data available in all views

// Set server port - use environment variable or default to 3000
const port = process.env.PORT ? process.env.PORT : '3000';

// Connect to MongoDB database using connection string from environment variables
mongoose.connect(process.env.MONGODB_URI);

// Event listener for successful database connection
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// MIDDLEWARE SETUP (order matters!)

// Parse URL-encoded form data (from HTML forms) into req.body
app.use(express.urlencoded({ extended: false }));

// Enable method override to use PUT/DELETE in HTML forms via ?_method=PUT
app.use(methodOverride('_method'));

// HTTP request logging
app.use(morgan('dev'));

// Session configuration for user authentication
app.use(
  session({
    secret: process.env.SESSION_SECRET,  // Secret key for signing session cookies
    resave: false,                       // Don't save session if unmodified
    saveUninitialized: true,            // Save new sessions even if not modified
  })
);

// ROUTES SETUP

// Home page route - displays welcome page with navigation
app.get('/', (req, res) => {
  res.render('index.ejs', {
    user: req.session.user,  // Pass current user to view for conditional rendering
  });
});

// Apply middleware in specific order for proper functionality
app.use(passUserToView);                    // Makes user data available in ALL views via res.locals
app.use('/auth', authController);           // Authentication routes (sign-up/in/out) - no login required
app.use(isSignedIn);                       // From this point on, ALL routes require authentication
app.use('/users/:userId/foods', foodsController); // Pantry management routes - login required

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});
