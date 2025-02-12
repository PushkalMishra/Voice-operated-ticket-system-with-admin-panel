const express = require('express');
const Train = require('../models/Train');
const Booking = require('../models/Booking');
const { isLoggedIn } = require('../middleware');
const router = express.Router();

// GET: List all trains
router.get('/',isLoggedIn, async (req, res) => {
    try {
        const trains = await Train.find({});
        console.log(trains)
        res.render('admin/trains', { trains,isAdmin: res.locals.isAdmin});
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching trains");
    }
});

// POST: Search trains

router.post('/search', async (req, res) => {
    const { from, to, trainNumber } = req.body;
  
    try {
      let trains = [];
  
      if (trainNumber) {
        console.log(trainNumber)
        // Search by train number
        const train = await Train.findOne({ trainNumber: Number(trainNumber) });
        if (!train) {
          return res.status(404).send("Train not found");
        }
        trains = [train]; // Wrap the single train in an array for consistency
      } else if (from && to) {
        // Search by from-to stations
        trains = await Train.find({ "route.station": { $all: [from, to] } });
        if (trains.length === 0) {
          return res.status(404).send("No trains found for the given route");
        }
      } else {
        return res.status(400).send("Please provide valid search criteria (from-to stations or train number)");
      }
  
      console.log("Trains Found:", trains);
      res.render('admin/trains', { trains, isAdmin: false });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error searching trains");
    }
  });
// router.post('/search', async (req, res) => {
//     const { from, to,} = req.body;
//     try {
//         const trains = await Train.find({ "route.station": { $all: [from, to] } });
//         console.log(trains)
//         res.render('admin/trains', { trains,isAdmin: false});
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error searching trains");
//     }
// });


// router.post('/search-train', async (req, res) => {
//     try {
//         const {trainNumber}=req.body
//         console.log(trainNumber)
//         const train = await Train.findOne({ trainNumber: Number(trainNumber)});
//         if (!train) return res.status(404).send("Train not found");
//         console.log(train)
//         res.render('admin/trains', { trains: [train],isAdmin: false});
//     } catch (err) {
//         console.error(err);
//         res.status(500).send("Error fetching train details");
//     }
// });



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
