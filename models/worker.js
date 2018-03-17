const mongoose = require('mongoose');
const roleSchema = require('./role');
const timeoffSchema = require('./timeoff');

// Converts value to lowercase
function toLower(v) {
    return v.toLowerCase();
};
  
// Define a worker Schema
const workerSchema = mongoose.Schema({
    firstname: { type: String, set: toLower },
    lastname: { type: String, set: toLower },
    phone: { type: String, set: toLower },
    email: { type: String, set: toLower },
    roles: [roleSchema],
    timeoff: [timeoffSchema],
  });

const Worker = mongoose.model('Worker', workerSchema);

module.exports = { Worker };