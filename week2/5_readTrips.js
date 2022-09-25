const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const trips = mongoCollections.trips;
const users = mongoCollections.users;

const readTrips = async(username) => {
    // get the users collection
    let userList = await users(); 

    // search the users collection for the specified user
    let user = await userList.findOne({ username: username });
    // if the user is not found, throw an error
    if(user === null) throw new Error("No user found with that user name!");
    
    // since it's not null, we know that there is an array of trip ids stored in the user
    // but we want to get the actual trip objects, so we need to go through the trips collection
    let tripIds = user.trips;

    // create an array to store the trip objects
    let tripStorage = [];

    // get the trips collection
    let tripList = await trips();

    // loop through the trip ids and add the trips to the array
    for(let x of tripIds) {
        // this for loop format means that x is the current trip id
        // it will loop through the entire array automatically

        // search the trips collection for the trip with the current trip id
        // x is a string, so we need to convert it to an ObjectId
        // we can do this with the ObjectId function from the mongodb package
        let trip = await tripList.findOne({ _id: ObjectId(x) });

        /* you could throw an error here if the trip is not found, 
           or you could just continue, 
           or you can assume your data will always be perfect */
        
        // store the trip object in tripStorage
        tripStorage.push(trip);
    }

    // return the array of trip objects
    return tripStorage;
};

// this allows for other files to use this function
module.exports = {
    readTrips
}