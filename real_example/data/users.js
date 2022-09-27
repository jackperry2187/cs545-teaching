const { ObjectId } = require('mongodb');
const mongoCollections = require('../config/mongoCollections');
const users = mongoCollections.users;

const readUser = async(userId) => {
    let userList = await users();

    let user = await userList.findOne({ _id: ObjectId(userId) });
    if(user === null) throw new Error("No user found with that id!");

    return user;
};

const patchUser = async(userId, patchObject) => {  
    let userList = await users();

    let user = await userList.findOne({ _id: ObjectId(userId) });
    if(user === null) throw new Error("No user found with that id!");

    let updatedUser = {
        _id: user._id,
        username: patchObject.username || user.username,
        password: patchObject.password || user.password
    };

    let updatedInfo = await userList.updateOne({ _id: ObjectId(userId) }, { $set: updatedUser });
    if(updatedInfo.matchedCount === 0) throw new Error("Could not update user!");

    return updatedUser;
};

const createUser = async(username, password) => {  
    let userList = await users();

    let newUser = {
        username: username,
        password: password,
        trips: []
    };

    let insertInfo = await userList.insertOne(newUser);
    if(insertInfo.insertedCount === 0) throw new Error("Could not add user!");

    const createdUser = await users.findOne({ _id: insertInfo.insertedId });

    return createdUser;
};

module.exports = {
    readUser,
    patchUser,
    createUser
}