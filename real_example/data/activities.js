const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const trips = mongoCollections.trips;
const activities = mongoCollections.activities;

const readActivity = async(activityId) => {
    let activityList = await activities();

    let activity = await activityList.findOne({ _id: ObjectId(activityId) });
    if(activity === null) throw new Error("No activity found with that id!");

    return activity;
};

const readActivities = async(tripId) => {
    let tripList = await trips(); 

    let trip = await tripList.findOne({ _id: tripId });
    if(trip === null) throw new Error("No trip found with that id!");
    
    let activityIds = trip.activities;
    let activityStorage = [];
    let activityList = await activities();

    for(let x of activityIds) {
        let activity = await activityList.findOne({ _id: ObjectId(x) });
        activityStorage.push(activity);
    }

    return activityStorage;
};

const patchActivity = async(activityId, patchObject) => {  
    let activityList = await activities();

    let activity = await activityList.findOne({ _id: ObjectId(activityId) });
    if(activity === null) throw new Error("No activity found with that id!");

    let updatedActivity = {
        _id: activity._id,
        type: patchObject.type || activity.type,
        info: patchObject.info || activity.info,
    };

    let updatedInfo = await activityList.updateOne({ _id: ObjectId(activityId) }, { $set: updatedActivity });
    if(updatedInfo.matchedCount === 0) throw new Error("Could not update activity!");

    return updatedActivity;
}

const createActivity = async(tripId, type, info) => {  
    let activityList = await activities();

    let newActivity = {
        type: type,
        info: info,
    };

    let insertInfo = await activityList.insertOne(newActivity);
    if(insertInfo.insertedCount === 0) throw new Error("Could not add activity!");

    const createdActivity = await activityList.findOne({ _id: insertInfo.insertedId });

    let tripList = await trips();
    let trip = await tripList.findOne({ _id: ObjectId(tripId) });
    if(trip === null) throw new Error("No trip found with that id!");

    let activityIds = trip.activities;
    activityIds.push(insertInfo.insertedId);

    let updateInfo = await tripList.updateOne({ _id: ObjectId(tripId) }, { $set: { activities: activityIds } });
    if(updateInfo.matchedCount === 0) throw new Error("Could not update trip!");

    return createdActivity;
};

const deleteActivity = async(activityId) => {  
    let activityList = await activities();
    let deleted = await activityList.deleteOne({ _id: ObjectId(activityId) });
    if(deleted.deletedCount !== 1) throw new Error("Could not delete activity!");

    let tripList = await trips();
    let updated = await tripList.updateOne({ trips: tripId }, { $pull: { activities: activityId } });
    if(updated.modifiedCount !== 1) throw new Error("Could not delete activity from trip!");

    return true;
}

module.exports = {
    readActivity,
    readActivities,
    patchActivity,
    createActivity,
    deleteActivity
}