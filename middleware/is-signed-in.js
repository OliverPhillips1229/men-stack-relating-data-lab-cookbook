// Middleware function to protect routes that require user authentication
// This acts as a "guard" to ensure only logged-in users can access certain pages
const isSignedIn = (req, res, next) => {
  // Check if user data exists in the session (means they're logged in)
  if (req.session.user) {
    // User is authenticated - allow them to continue to the requested route
    return next(); // next() passes control to the next middleware/route handler
  }
  res.redirect('/auth/sign-in');
};

// Export the middleware function so it can be imported in server.js
module.exports = isSignedIn;
