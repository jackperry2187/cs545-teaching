const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const trips = mongoCollections.trips;
const users = mongoCollections.users;

const deleteTrip = async(tripId) => {  
    // get the trips collection
    let tripList = await trips();

    // delete the trip from the trips collection
    // tripId is a string, so we need to convert it to an ObjectId
    // we can do this with the ObjectId function from the mongodb package
    // the deleteOne function returns an object with a deletedCount property
    let deleted = await tripList.deleteOne({ _id: ObjectId(tripId) });
    // if the trip is not found, throw an error
    if(deleted.deletedCount !== 1) throw new Error("Could not delete trip!");

    // get the users collection
    let userList = await users();

    // delete the trip from the users collection
    // the updateOne function returns an object with a modifiedCount property
    // trips: tripId searches the trips array for the trip id
    // $pull removes the trip id from that array
    let updated = await userList.updateOne({ trips: tripId }, { $pull: { trips: tripId } });
    // if the trip is not found, throw an error
    if(updated.modifiedCount !== 1) throw new Error("Could not delete trip from user!");

    // return true if the trip was deleted
    return true;
}

// this allows for other files to use this function
module.exports = {
    deleteTrip
}