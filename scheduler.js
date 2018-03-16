const mongoose = require('mongoose'); // An Object-Document Mapper for Node.js
const assert = require('assert'); // N.B: Assert module comes bundled with Node.js.

// Converts value to lowercase
function toLower(v) {
  return v.toLowerCase();
};

const workerSchema = mongoose.Schema({
  firstname: { type: String, set: toLower },
  lastname: { type: String, set: toLower }
});

// Define a schedule Schema
const scheduleSchema = mongoose.Schema({
  datestart: { type: Date },
  dateend: { type: Date },
  type: { type: String, set: toLower },
  workers: [workerSchema]
});

// Define model as an interface with the database
const Schedule = mongoose.model('Schedule', scheduleSchema);

/**
 * @function  [addSchedule]
 * @returns {String} Status
 */
const addSchedule = (schedule) => {
  Schedule.create(schedule, (err) => {
    assert.equal(null, err);
    console.info('New schedule added');
    mongoose.disconnect();
  });
};

/**
 * @function  [getSchedule]
 * @returns {Json} schedules
 */
const getSchedule = (name) => {
  // Define search criteria. The search here is case-insensitive and inexact.
  const search = new RegExp(name, 'i');
  Schedule.find({$or: [{firstname: search }, {lastname: search }]})
  .exec((err, schedule) => {
    assert.equal(null, err);
    console.info(schedule);
    console.info(`${schedule.length} matches`);
    mongoose.disconnect();
  });
};

// Export all methods
module.exports = {  addSchedule, getSchedule };