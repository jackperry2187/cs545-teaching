const express = require('express');
const router = express.Router();
const tripData = require('../data/trips');

router.post('/', async (req, res) => {
    // create a new trip
    try {
        // get all the information from the body of the request
        // this is called destructuring
        // it is the same as doing
        // const userId = req.body.userId;
        // const destination = req.body.destination; etc.
        const { userId, destination, startDate, endDate } = req.body;

        // create the trip using the createTrip function we wrote
        // this is the true purpose of routes:
        // being able to convert data the frontend passes you into data the backend can use
        // in this case, lets assume the frontend gives us strings like "09-01-2020" for a start date
        // well, we really just want to use a Date object since it's built in to javascript and nice to use
        // so we convert the string into a Date object here before we give it to the data function
        const trip = await tripData.createTrip(userId, destination, new Date(startDate), new Date(endDate));
        
        // redirect to the newly created trip
        // res.redirect takes in 1 parameter
        // 1. the url to redirect to
        // this means that the user will be redirected to www.example.com/trips/1234
        // which will be handled by the get trip route we just wrote
        res.redirect('/trips/' + trip._id);
    }
    catch (e) {
        // if there is an error, return a 404 status code and the error message
        // a res.render automatically has a status code of 200
        // you could also res.render some type of error page here
        res.status(404).json({ error: e });
    }
});

module.exports = router;

