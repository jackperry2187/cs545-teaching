const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const trips = mongoCollections.trips;
const users = mongoCollections.users;

const readTrip = async(tripId) => {
    let tripList = await trips();

    let trip = await tripList.findOne({ _id: ObjectId(tripId) });
    if(trip === null) throw new Error("No trip found with that id!");

    return trip;
};

const readTrips = async(username) => {
    let userList = await users(); 

    let user = await userList.findOne({ username: username });
    if(user === null) throw new Error("No user found with that user name!");
    
    let tripIds = user.trips;
    let tripStorage = [];
    let tripList = await trips();

    for(let x of tripIds) {
        let trip = await tripList.findOne({ _id: ObjectId(x) });
        tripStorage.push(trip);
    }

    return tripStorage;
};

const patchTrip = async(tripId, patchObject) => {  
    let tripList = await trips();

    let trip = await tripList.findOne({ _id: ObjectId(tripId) });
    if(trip === null) throw new Error("No trip found with that id!");

    let updatedTrip = {
        _id: trip._id,
        destination: patchObject.destination || trip.destination, 
        startDate: patchObject.startDate || trip.startDate,
        endDate: patchObject.endDate || trip.endDate,
        flights: patchObject.flights || trip.flights,
        hotel_stays: patchObject.hotel_stays || trip.hotel_stays,
    };

    let updatedInfo = await tripList.updateOne({ _id: ObjectId(tripId) }, { $set: updatedTrip });
    if(updatedInfo.matchedCount === 0) throw new Error("Could not update trip!");

    return updatedTrip;
}

const createTrip = async(userId, destination, startDate, endDate) => {  
    let tripList = await trips();

    let newTrip = {
        destination: destination,
        startDate: startDate,
        endDate: endDate,
        flights: 0,
        hotel_stays: 0,
        activities: []
    };

    let insertInfo = await tripList.insertOne(newTrip);
    if(insertInfo.insertedCount === 0) throw new Error("Could not add trip!");

    const createdTrip = await tripList.findOne({ _id: insertInfo.insertedId });

    let userList = await users();
    let user = await userList.findOne({ _id: ObjectId(userId) });
    if(user === null) throw new Error("No user found with that id!");

    let tripIds = user.trips;
    tripIds.push(insertInfo.insertedId);

    let updateInfo = await userList.updateOne({ _id: ObjectId(userId) }, { $set: { trips: tripIds } });
    if(updateInfo.matchedCount === 0) throw new Error("Could not update user!");

    return createdTrip;
};

const deleteTrip = async(tripId) => {  
    let tripList = await trips();
    let deleted = await tripList.deleteOne({ _id: ObjectId(tripId) });
    if(deleted.deletedCount !== 1) throw new Error("Could not delete trip!");

    let userList = await users();
    let updated = await userList.updateOne({ trips: tripId }, { $pull: { trips: tripId } });
    if(updated.modifiedCount !== 1) throw new Error("Could not delete trip from user!");

    return true;
}

module.exports = {
    readTrip,
    readTrips,
    patchTrip,
    createTrip,
    deleteTrip
}