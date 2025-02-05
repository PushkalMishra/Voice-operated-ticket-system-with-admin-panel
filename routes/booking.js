const Booking = require('../models/Booking');
const Train = require('../models/Train');
const express = require('express');
const {isLoggedIn}=require('../middleware')
const router=express.Router();
// POST: Book a ticket
router.post('/:id/book',isLoggedIn,async (req, res) => {
    console.log("User ID:", req.user._id); // Debugging to check if user is available

    if (!req.user) {
        return res.status(401).json({ error: "Unauthorized. Please log in." });
    }
    try {
        const { seatClass, date } = req.body;
        const train = await Train.findById(req.params.id);
        if (!train || train.availableSeats[seatClass] <= 0) {
            req.flash("error", "No available seats");
            return res.redirect(`/trains/${req.params.id}`);
        }
        const booking = new Booking({
            user: req.user._id,
            train: train._id,
            seatClass,
            date,
            fare: train.fare[seatClass]
        });

        train.availableSeats[seatClass] -= 1;
        await train.save();
        await booking.save();
        console.log(booking)
        // req.flash("success", "Booking confirmed!");
        res.redirect('/bookings/history');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error booking ticket");
    }
});

// GET: Booking History
router.get('/history',isLoggedIn, async (req, res) => {
    console.log("User ID:", req.user._id); 
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('train');
        console.log(bookings)
        res.render('bookings/history', { bookings });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching booking history");
    }
});
module.exports=router;