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

        // No need to parse route if it's already a JSON object
        const train = new Train({
            trainNumber,
            name,
            route, // Directly use the route object
            availableSeats: { sleeper, ac, general },
            fare: { sleeper: sleeperFare, ac: acFare, general: generalFare }
        });

        const t=await train.save();
        console.log(t)
        // res.redirect('/admin/trains');
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
        const { name, route, sleeper, ac, general, sleeperFare, acFare, generalFare } = req.body;

        await Train.findByIdAndUpdate(req.params.id, {
            name, 
            route: route,
            availableSeats: { sleeper, ac, general },
            fare: { sleeper: sleeperFare, ac: acFare, general: generalFare }
        });

        // req.flash('success', 'Train updated successfully');
        // res.redirect('/admin/trains');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating train");
    }
});

router.post('/:id/delete', async (req, res) => {
    try {
        await Train.findByIdAndDelete(req.params.id);
        // req.flash('success', 'Train removed successfully');
        // res.redirect('/admin/trains');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting train");
    }
});
module.exports=router;