const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const trips = mongoCollections.trips;
const users = mongoCollections.users;

const createTrip = async(userId, destination, startDate, endDate) => {  
    // get the trips collection
    let tripList = await trips();

    // create a new trip object, but leave out the _id field
    // mongo will add the _id field for us
    // the destination, startDate, and endDate fields are required because there isn't really a "default" value for them
    let newTrip = {
        destination: destination,
        startDate: startDate,
        endDate: endDate,
        flights: 0,
        hotel_stays: 0,
        activities: []
    };

    // insert the new trip into the trips collection
    // the insertOne function returns an object with an insertedId field
    // this is the id of the new trip
    let insertInfo = await tripList.insertOne(newTrip);
    // if the insert failed, throw an error
    if(insertInfo.insertedCount === 0) throw new Error("Could not add trip!");

    // use the insertedId to get the new trip object
    const createdTrip = await trips.findOne({ _id: insertInfo.insertedId });
    // but dont return yet! we need to add the trip to the user's trips array

    // get the users collection
    let userList = await users();

    // search the users collection for the specified user
    let user = await userList.findOne({ _id: ObjectId(userId) });
    // if the user is not found, throw an error
    if(user === null) throw new Error("No user found with that id!");

    // since it's not null, we know that there is an array of trip ids stored in the user
    // but we want to add the new trip id to the array
    let tripIds = user.trips;

    // add the new trip id to the array
    tripIds.push(insertInfo.insertedId);

    // update the user's trips array
    // the updateOne function returns an object with an matchedCount and modifiedCount field
    // these are the number of documents that matched the filter and the number of documents that were modified
    // $set is a mongodb operator that sets the value of a field in a document
    let updateInfo = await userList.updateOne({ _id: ObjectId(userId) }, { $set: { trips: tripIds } });
    // if the update failed, throw an error
    if(updateInfo.matchedCount === 0) throw new Error("Could not update user!");

    // return the new trip object
    return createdTrip;
};

// this allows for other files to use this function
module.exports = {
    createTrip
}