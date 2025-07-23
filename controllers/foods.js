// Import Express framework to create router
const express = require('express');
// Create a new router instance to handle food-related routes
const router = express.Router();

// Import User model to interact with user data and embedded pantry
const User = require('../models/user.js');

// INDEX ROUTE - Display all food items in user's pantry

router.get('/', async (req, res) => {
    try {
        // Find the current user from session data stored when they logged in
        const user = await User.findById(req.session.user._id);

        // Render the foods index page, passing the user's pantry array as 'foods'
        // This allows the view to loop through and display all food items
        res.render('foods/index.ejs', {
            foods: user.pantry, // pantry is an embedded array of food objects
        });
    } catch (error) {
        // If database error occurs, log it and redirect to home page
        console.log(error);
        res.redirect('/');
    }
});

// NEW ROUTE - Display form to add a new food item

router.get('/new', (req, res) => {
    // Simply render the new food form - no database query needed
    res.render('foods/new.ejs');
});

// CREATE ROUTE - Process form submission to add new food item

router.post('/', async (req, res) => {
    try {
        // Find the current user from session
        const user = await User.findById(req.session.user._id);

        // Add the new food item (from form data) to the user's pantry array
        // req.body contains the form data (name field in this case)
        user.pantry.push(req.body);

        // Save the updated user document to the database
        await user.save();

        // Redirect back to the pantry index to show the new item
        res.redirect(`/users/${user._id}/foods`);
    } catch (error) {
        // Handle any errors during creation process
        console.log(error);
        res.redirect('/');
    }
});

// EDIT ROUTE - Display form pre-filled with existing food item data

router.get('/:itemId/edit', async (req, res) => {
    try {
        // Find the user from session
        const user = await User.findById(req.session.user._id);

        // Find the specific food item within the pantry array using its _id
        // Mongoose provides .id() method to find subdocuments by their _id
        const food = user.pantry.id(req.params.itemId);

        // Render edit form with the current food data pre-populated
        res.render('foods/edit.ejs', {
            food: food, // Pass the food object to pre-fill form fields
        });
    } catch (error) {
        // Handle errors and redirect to safety
        console.log(error);
        res.redirect('/');
    }
});

// UPDATE ROUTE - Process form submission to update existing food item

router.put('/:itemId', async (req, res) => {
    try {
        // Find the user from session
        const user = await User.findById(req.session.user._id);

        // Locate the specific food item to update
        const food = user.pantry.id(req.params.itemId);

        // Update the food item with new form data
        // .set() method updates the subdocument with new values from req.body
        food.set(req.body);

        // Save the entire user document (including the updated embedded food)
        await user.save();

        // Redirect back to pantry index to see the changes
        res.redirect(`/users/${user._id}/foods`);
    } catch (error) {
        // Handle update errors
        console.log(error);
        res.redirect('/');
    }
});

// DELETE ROUTE - Remove a food item from user's pantry

router.delete('/:itemId', async (req, res) => {
    try {
        // Find the user from session
        const user = await User.findById(req.session.user._id);

        // Remove the specific food item from the pantry array
        // .pull() method finds the subdocument by its _id and removes it from the array
        user.pantry.pull({ _id: req.params.itemId });

        // Save the user document to persist the deletion
        await user.save();

        // Redirect back to pantry index (item will no longer appear)
        res.redirect(`/users/${user._id}/foods`);
    } catch (error) {
        // Handle deletion errors
        console.log(error);
        res.redirect('/');
    }
});

// Export the router so it can be used in server.js
module.exports = router;
