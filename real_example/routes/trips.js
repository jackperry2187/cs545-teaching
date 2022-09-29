const express = require('express');
const router = express.Router();
const tripData = require('../data/trips');

router.get('/', async (req, res) => {
    // get all trips for logged in user
    try {
        if(!req.session.user) {
            res.status(401).json({ error: 'You must be logged in to view trips!' });
            return;
        }
        const trips = await tripData.readTrips(req.session.user.username);
        res.render('trips', { trips: trips });
    }
    catch (e) {
        res.status(404).json({ error: e });
    }
});

module.exports = router;