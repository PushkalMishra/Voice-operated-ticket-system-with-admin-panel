const express = require('express');
const Train = require('../models/Train');
const Booking = require('../models/Booking');
const router = express.Router();

// GET: List all trains
router.get('/', async (req, res) => {
    try {
        const trains = await Train.find({});
        console.log(trains)
        res.render('admin/trains', { trains,isAdmin: false});
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching trains");
    }
});

// POST: Search trains
router.post('/search', async (req, res) => {
    const { from, to,} = req.body;
    try {
        const trains = await Train.find({ "route.station": { $all: [from, to] } });
        console.log(trains)
        res.render('admin/trains', { trains,isAdmin: false});
    } catch (err) {
        console.error(err);
        res.status(500).send("Error searching trains");
    }
});


router.get('/search-train', async (req, res) => {
    try {
        const {trainNumber}=req.query
        console.log(trainNumber)
        const train = await Train.findOne({ trainNumber: Number(trainNumber)});
        if (!train) return res.status(404).send("Train not found");
        console.log(train)
        res.render('admin/trains', { trains: [train],isAdmin: false});
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching train details");
    }
});



router.get('/:trainNumber/availability', async (req, res) => {
    try {
        const train = await Train.findOne({ trainNumber: req.params.trainNumber });
        if (!train) return res.status(404).send("Train not found");
        res.json(train.availableSeats);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error checking seat availability");
    }
});

module.exports = router;
