const mongoose = require('mongoose');

// Converts value to lowercase
function toLower(v) {
    return v.toLowerCase();
};
  
// Define a timeOff Schema
const timeoffSchema = mongoose.Schema({
    datestart: { type: Date },
    dateend: { type: Date }
  });

module.exports = { timeoffSchema };