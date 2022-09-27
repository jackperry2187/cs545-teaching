const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings');
const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;
let username = "TODO: replace this with your actual mongo username";
let password = "TODO: replace this with your actual mongo password";
let uri = `mongodb+srv://${username}:${password}@cluster0.miex7.mongodb.net/test?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async () => {
  if (!_connection) {
    _connection = await client.connect();
    _db = await _connection.db(mongoConfig.database);
  }

  return _db;
};