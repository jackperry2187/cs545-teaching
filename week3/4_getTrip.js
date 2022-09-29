const express = require('express');
const router = express.Router();
const tripData = require('../data/trips');

router.get('/:id', async (req, res) => {
    // get the specified trip
    try {
        // grab the id from the url
        // if the url was www.example.com/trips/1234, then req.params.id would be 1234
        const id = req.params.id;

        // get the trip from the database by calling the readTrip function we wrote
        const trip = await tripData.readTrip(id);

        // render the trip page with the trip data
        // res.render takes in 2 parameters
        // 1. the name of the file to render
        // 2. the data to pass to the file, in object format
        // this means that in the trip.handlebars file, we can access the trip data by using the variable name "trip"
        res.render('trip', { trip: trip });
    }
    catch (e) {
        // if there is an error, return a 404 status code and the error message
        // a res.render automatically has a status code of 200
        // you could also res.render some type of error page here
        res.status(404).json({ error: e });
    }
});

module.exports = router;

