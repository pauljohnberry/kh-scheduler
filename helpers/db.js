const mongoose = require('mongoose'); // An Object-Document Mapper for Node.js
mongoose.Promise = global.Promise; // Allows us to use Native promises without throwing error.

const rm = require('../models/role');
const sm = require('../models/schedule');
const sim = require('../models/schedule-item');
const tom = require('../models/timeoff');
const wm = require('../models/worker');

// Connect to a single MongoDB instance. The connection string could be that of a remote server
// We assign the connection instance to a constant to be used later in closing the connection

var dbURI = 'mongodb://localhost:27017/kh-scheduler'; //+ 'test'; 
const db = mongoose.connection;

db.on('connecting', function() {
    //console.log('connecting');
});
 
db.on('error', function(error) {
    //console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});

db.on('connected', function() {
    //console.log('connected!');
});

db.once('open', function() {
    //console.log('connection open');
});

db.on('reconnected', function () {
    //console.log('reconnected');
});

db.on('disconnected', function() {
    //console.log('disconnected');
    //console.log('dbURI is: '+dbURI);
    //mongoose.connect(dbURI);
});
//console.log('dbURI is: '+dbURI);

connect = function () { 
    mongoose.connect(dbURI, function(e) {  process.nextTick; } ); 
};

disconnect = function () { 
    mongoose.disconnect(); 
};

execute = function (func) {
    var createDb = function() { return new Promise((resolve, reject) => { 
        connect();
        resolve(true);
    })};

    var disconnectDb = function(response) { return new Promise((resolve, reject) => { 
        disconnect();
        resolve(response);
    })};

    return createDb().then(func).then(disconnectDb);
};


module.exports = { mongoose, rm, sm, sim, tom, wm, execute };