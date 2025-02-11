const express = require('express');
const router=express.Router();
const Train = require('../models/Train');
router.get('/new', (req, res) => {
    res.render('admin/newTrain');
});


router.post('/new', async (req, res) => {
    try {
        console.log("Request Body:", req.body);
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
        console.log(t)
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
        console.log("Request Body:", req.body);
        const { name, route, sleeper, ac, general, sleeperFare, acFare, generalFare,status } = req.body;
        const parsedRoute = JSON.parse(route);
        await Train.findByIdAndUpdate(req.params.id, {
            name, 
            route: parsedRoute,
            availableSeats: { sleeper, ac, general },
            fare: { sleeper: sleeperFare, ac: acFare, general: generalFare },
            status
        });

        // req.flash('success', 'Train updated successfully');
        res.redirect('/admin/trains');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating train");
    }
});
router.get('/trains', async (req, res) => {
    try {
        const trains = await Train.find({}); // Fetch all trains from the database
        res.render('admin/trains', { trains ,isAdmin: true}); // Render the trains view
    } catch (err) {
        console.error("Error fetching trains:", err.message);
        res.status(500).send("Error fetching trains: " + err.message);
    }
});
// router.post('/:id/delete', async (req, res) => {
//     try {
//         await Train.findByIdAndDelete(req.params.id);
//         // req.flash('success', 'Train removed successfully');
//         res.redirect('/admin/trains');
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error deleting train");
//     }
// });
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