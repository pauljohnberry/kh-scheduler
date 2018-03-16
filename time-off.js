const mongoose = require('mongoose'); // An Object-Document Mapper for Node.js
const assert = require('assert'); // N.B: Assert module comes bundled with Node.js.

// Converts value to lowercase
function toLower(v) {
  return v.toLowerCase();
};

// Define a time off Schema
const timeOffSchema = mongoose.Schema({
  datestart: { type: Date },
  dateend: { type: Date },
  firstname: { type: String, set: toLower },
  lastname: { type: String, set: toLower }
});

// Define model as an interface with the database
const TimeOff = mongoose.model('TimeOff', timeOffSchema);

/**
 * @function  [addTimeOff]
 * @returns {String} Status
 */
const addTimeOff = (timeOff) => {
  TimeOff.create(timeOff, (err) => {
    assert.equal(null, err);
    console.info('New time off recorded');
    mongoose.disconnect();
  });
};

/**
 * @function  [getTimeOff]
 * @returns {Json} timeOff
 */
const getTimeOff = (name) => {
  // Define search criteria. The search here is case-insensitive and inexact.
  const search = new RegExp(name, 'i');
  TimeOff.find({$or: [{firstname: search }, {lastname: search }]})
  .exec((err, timeOff) => {
    assert.equal(null, err);
    console.info(timeOff);
    console.info(`${timeOff.length} matches`);
    mongoose.disconnect();
  });
};

// Export all methods
module.exports = { addTimeOff, getTimeOff };