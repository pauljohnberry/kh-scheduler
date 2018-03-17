const mongoose = require('mongoose'); // An Object-Document Mapper for Node.js
const assert = require('assert'); // N.B: Assert module comes bundled with Node.js.
const roleSchema = require('./models/role');
const timeoffSchema = require('./models/timeoff');
const workerSchema = require('./models/worker');

// Converts value to lowercase
function toLower(v) {
  return v.toLowerCase();
};

// // Define a role Schema
// const roleSchema = mongoose.Schema({
//   type: { type: String, set: toLower }
// });

// // Define a timeOff Schema
// const timeoffSchema = mongoose.Schema({
//   datestart: { type: Date },
//   dateend: { type: Date }
// });

// // Define a worker Schema
// const workerSchema = mongoose.Schema({
//   firstname: { type: String, set: toLower },
//   lastname: { type: String, set: toLower },
//   phone: { type: String, set: toLower },
//   email: { type: String, set: toLower },
//   roles: [roleSchema],
//   timeoff: [timeoffSchema],
// });

// // Define model as an interface with the database
// const Worker = mongoose.model('Worker', workerSchema);

/**
 * @function  [addWorker]
 * @returns {String} Status
 */
const addWorker = (worker) => {
  Worker.create(worker, (err) => {
    assert.equal(null, err);
    console.info('worker added');
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

/**
 * @function  [listWorkers]
 * @returns {Json} workers
 */
const listWorkers = () => {
  Worker.find()
    .exec((err, worker) => {
      assert.equal(null, err);
      console.info(worker);
      console.info(`${worker.length} matches`);
      mongoose.disconnect();
    });
};

/**
 * @function  [setWorkerRole]
 * @returns {String} Status
 */
const setWorkerRole = (id, role) => {
  Worker.findOne({ _id: id })
  .exec((err, worker) => {
    assert.equal(null, err);
    worker? worker.roles.push(role) : console.info("worker not found")
    mongoose.disconnect();
  })
};

/**
 * @function  [setWorkerTimeOff]
 * @returns {String} Status
 */
const setWorkerTimeOff = (id, timeoff) => {
  Worker.findOne({ _id: id })
  .exec((err, worker) => {
    assert.equal(null, err);
    worker? worker.roles.push(role) : console.info("worker not found")
    worker.timeoff.push(timeoff);
    mongoose.disconnect();
  })
};

// Export all methods
module.exports = {  addWorker, getWorker, listWorkers, setWorkerRole, setWorkerTimeOff };