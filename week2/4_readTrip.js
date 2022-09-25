const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const trips = mongoCollections.trips;

const readTrip = async(tripId) => {
    // get the trips collection
    let tripList = await trips();

    // search the trips collection for the specified trip
    // tripId is a string, so we need to convert it to an ObjectId
    // we can do this with the ObjectId function from the mongodb package
    let trip = await tripList.findOne({ _id: ObjectId(tripId) });
    // if the trip is not found, throw an error
    if(trip === null) throw new Error("No trip found with that id!");

    // return the trip object
    return trip;
};

// this allows for other files to use this function
module.exports = {
    readTrip
}