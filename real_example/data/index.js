const users = require('./users');
const trips = require('./trips');
const activities = require('./activities');

const constructorMethod = (app) => {
	// our server with a url of "/users/*" will use the users router, same with trips and activities
	app.use('/users', users);
	app.use('/trips', trips);
	app.use('/activities', activities);

	app.use('*', (req, res) => {
		// this is used as a catch-all route
		// if you're accessing our server, and not using one of the routes above
		// then you'll get this error message
		res.status(404).json({ error: 'Not found' });
	});
};
  
  module.exports = constructorMethod;