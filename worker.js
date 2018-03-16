const mongoose = require('mongoose'); // An Object-Document Mapper for Node.js
const assert = require('assert'); // N.B: Assert module comes bundled with Node.js.

// Converts value to lowercase
function toLower(v) {
  return v.toLowerCase();
};

// Define a worker Schema
const workerSchema = mongoose.Schema({
  firstname: { type: String, set: toLower },
  lastname: { type: String, set: toLower },
  phone: { type: String, set: toLower },
  email: { type: String, set: toLower }
});

// Define model as an interface with the database
const Worker = mongoose.model('Worker', workerSchema);

/**
 * @function  [addWorker]
 * @returns {String} Status
 */
const addWorker = (worker) => {
  Worker.create(worker, (err) => {
    assert.equal(null, err);
    console.info('New worker added');
    mongoose.disconnect();
  });
};

/**
 * @function  [getWorker]
 * @returns {Json} workers
 */
const getWorker = (name) => {
  // Define search criteria. The search here is case-insensitive and inexact.
  const search = new RegExp(name, 'i');
  Worker.find({$or: [{firstname: search }, {lastname: search }]})
  .exec((err, worker) => {
    assert.equal(null, err);
    console.info(worker);
    console.info(`${worker.length} matches`);
    mongoose.disconnect();
  });
};

// Export all methods
module.exports = {  addWorker, getWorker };