// Middleware function to make user data available in ALL view templates
// This eliminates the need to manually pass user data to every res.render() call
const passUserToView = (req, res, next) => {
    // Set res.locals.user which makes 'user' variable available in all EJS templates
    // res.locals creates variables that persist throughout the request lifecycle
    res.locals.user = req.session.user ? req.session.user : null;

    // Continue to the next middleware or route handler
    next();
};

// Export the middleware function so it can be imported in server.js
module.exports = passUserToView;
