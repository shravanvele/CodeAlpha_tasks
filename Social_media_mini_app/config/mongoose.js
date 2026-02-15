const mongoose = require('mongoose');
const environment = require('./environment')
require('dotenv/config');

mongoose.connect(environment.db);
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error connecting to MongoDB'));  //consol.error.bind will print console message as error!

db.once('open', function(){
    console.log('Connected To Database: MongoDB');
})

module.exports = db;