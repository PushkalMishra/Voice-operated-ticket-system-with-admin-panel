const express = require('express');
const router=express.Router();
const Train = require('../models/Train');
const { isLoggedIn } = require('../middleware');
router.get('/new',isLoggedIn, (req, res) => {
    if(res.locals.isAdmin){
    res.render('admin/newTrain');
    }
    else{
        return res.status(400).send("login as a admin");
        // req.flash('login as a admin');
    }
});


router.post('/new',isLoggedIn, async (req, res) => {
    try {
        const { trainNumber, name, route, sleeper, ac, general, sleeperFare, acFare, generalFare } = req.body;

        let parsedRoute;
        try {
            parsedRoute = JSON.parse(route);
        } catch (err) {
            console.error("Invalid route format:", err.message);
            return res.status(400).send("Invalid route format. Please provide a valid JSON array.");
        }
        // No need to parse route if it's already a JSON object
        const train = new Train({
            trainNumber,
            name,
            route : parsedRoute, // Directly use the route object
            availableSeats: { sleeper, ac, general },
            fare: { sleeper: sleeperFare, ac: acFare, general: generalFare }
        });

        const t=await train.save();
        res.redirect('/admin/trains');
    } catch (err) {
        console.error("Error:", err.message);
        res.status(500).send("Error adding train: " + err.message);
    }
});
router.get('/:id/edit', async (req, res) => {
    const train = await Train.findById(req.params.id);
    res.render('admin/editTrain', { train });
});

router.post('/:id/edit', async (req, res) => {
    try {
        const { name, route, sleeper, ac, general, sleeperFare, acFare, generalFare,status } = req.body;
        const parsedRoute = JSON.parse(route);
        await Train.findByIdAndUpdate(req.params.id, {
            name, 
            route: parsedRoute,
            availableSeats: { sleeper, ac, general },
            fare: { sleeper: sleeperFare, ac: acFare, general: generalFare },
            status
        });

        req.flash('success', 'Train updated successfully');
        res.redirect('/admin/trains');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating train");
    }
});
router.get('/trains',isLoggedIn, async (req, res) => {
    try {
        const trains = await Train.find({}); // Fetch all trains from the database
        res.render('admin/trains', { trains ,isAdmin: res.locals.isAdmin}); // Render the trains view
    } catch (err) {
        console.error("Error fetching trains:", err.message);
        res.status(500).send("Error fetching trains: " + err.message);
    }
});
router.delete('/:id', async (req, res) => {
    try {
        await Train.findByIdAndDelete(req.params.id);
        res.redirect('/admin/trains');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting train");
    }
});
module.exports=router;