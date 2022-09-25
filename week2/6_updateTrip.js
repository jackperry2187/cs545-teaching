const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const trips = mongoCollections.trips;

const patchTrip = async(tripId, patchObject) => {  
    // get the trips collection
    let tripList = await trips();

    // search the trips collection for the specified trip
    // tripId is a string, so we need to convert it to an ObjectId
    // we can do this with the ObjectId function from the mongodb package
    let trip = await tripList.findOne({ _id: ObjectId(tripId) });
    // if the trip is not found, throw an error
    if(trip === null) throw new Error("No trip found with that id!");

    // create a new object to store the updated trip
    let updatedTrip = {
        _id: trip._id,
        // this notation means that if patchObject.destination is undefined, use trip.destination
        // this means it will take any new fields from patchObject, but if it doesn't have a new value for a field, it will keep the old value
        // this is why it's called "patch", since you can patch the old object with specified fields of the new object
        destination: patchObject.destination || trip.destination, 
        startDate: patchObject.startDate || trip.startDate,
        endDate: patchObject.endDate || trip.endDate,
        flights: patchObject.flights || trip.flights,
        hotel_stays: patchObject.hotel_stays || trip.hotel_stays,
        // you can't update activities here, because you need to use the activities functions for that
    };

    // update the trip in the database
    // the updateOne function returns an object with an matchedCount and modifiedCount field
    // these are the number of documents that matched the filter and the number of documents that were modified
    // $set is a mongodb operator that sets the value of a field in a document
    let updatedInfo = await tripList.updateOne({ _id: ObjectId(tripId) }, { $set: updatedTrip });
    // if the update failed, throw an error
    if(updatedInfo.matchedCount === 0) throw new Error("Could not update trip!");

    // we don't need to update the user's trips array, because the trip id didn't change

    // return the updated trip object
    return updatedTrip;
}

// this allows for other files to use this function
module.exports = {
    patchTrip
}