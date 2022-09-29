const trips = require('./trips');
const activities = require('./activities');
const user = require('./users');

const constructorMethod = (app) => {
    app.use('/trips', trips); // www.example.com/trips/* will be handled by trips.js
    app.use('/activities', activities); // www.example.com/activities/* will be handled by activities.js
    app.use('/user', user); // www.example.com/user/* will be handled by user.js

    app.use('*', (req, res) => {
        res.status(404).json({ error: 'Not found' }); // if we get here, no other route matched
    });
};

module.exports = constructorMethod;