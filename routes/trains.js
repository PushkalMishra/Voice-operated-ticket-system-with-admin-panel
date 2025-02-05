const express = require('express');
const Train = require('../models/Train');
const Booking = require('../models/Booking');
const router = express.Router();

// GET: List all trains
router.get('/', async (req, res) => {
    try {
        const trains = await Train.find({});
        console.log(trains)
        // res.render('trains/index', { trains });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching trains");
    }
});

// POST: Search trains
router.post('/search', async (req, res) => {
    const { from, to, date } = req.body;
    try {
        const trains = await Train.find({ "route.station": { $all: [from, to] } });
        console.log(trains)
        // res.render('trains/searchResults', { trains, from, to, date });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error searching trains");
    }
});

// GET: Train details
router.get('/:id', async (req, res) => {
    try {
        const train = await Train.findById(req.params.id);
        if (!train) return res.status(404).send("Train not found");
        res.render('trains/show', { train });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching train details");
    }
});

// GET: Seat Availability
router.get('/:id/availability', async (req, res) => {
    try {
        const train = await Train.findById(req.params.id);
        res.json(train.availableSeats);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error checking seat availability");
    }
});



module.exports = router;
