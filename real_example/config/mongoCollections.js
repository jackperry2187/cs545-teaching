const dbConnection = require('./mongoConnection');

const getCollectionFn = (collection) => {
  let _col = undefined;

  return async () => {
    if (!_col) {
      const db = await dbConnection();
      _col = await db.collection(collection);
    }

    return _col;
  };
};

// TOOD: replace the collections below with the names of YOUR collections
module.exports = {
    users: getCollectionFn('users'),
    trips: getCollectionFn('trips'),
    activities: getCollectionFn('activities')
};