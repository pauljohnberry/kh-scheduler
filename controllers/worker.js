const db = require('../helpers/db'); 
const assert = require('assert'); 
const wm = require('../models/worker');
const rc = require('../controllers/role');

/**
 * @function  [addWorker]
 * @returns {String} Status
 */
const addWorker = (worker, roles) => {
  rc.getRolesByName(roles).then(function (roles) {
    worker.roles = roles;
    db.execute(() =>
    db.models.Worker.create(worker, (err, w) => {
      assert.equal(null, err);
      console.info('worker added');
      //db.disconnect();
    }));
  });
};

/**
 * @function  [getWorker]
 * @returns {Json} workers
 */
const getWorker = (name) => {
  // Define search criteria. The search here is case-insensitive and inexact.
  const search = new RegExp(name, 'i');
  db.models.Worker.find({$or: [{firstname: search }, {lastname: search }]})
    .exec((err, worker) => {
      assert.equal(null, err);
      console.info(worker);
      console.info(`${worker.length} matches`);
    });
};

/**
 * @function  [listWorkers]
 * @returns {Json} workers
 */
const listWorkers = () => {
  db.models.Worker.find()
    .exec((err, worker) => {
      assert.equal(null, err);
      console.info(worker);
      console.info(`${worker.length} matches`);
    });
};

/**
 * @function  [setWorkerRole]
 * @returns {String} Status
 */
const setWorkerRoles = (id, roles) => function() {
  return new Promise((resolve, reject) => {
    setWorkerRoles_workerId = id;
    if (Array.isArray(roles))
    {
      roles.forEach(r => {
        if(r.hasOwnProperty('_id')){
          setWorkerRole(setWorkerRoles_workerId, r);
        } 
        else {
          rc.getRoleByName(r).then(function (role) {
            setWorkerRole(setWorkerRoles_workerId, role);
          });
        };
      });
    };
  });
};

/**
 * @function  [setWorkerRole]
 * @returns {String} Status
 */
const setWorkerRole = (id, role) => {
  db.models.Worker.findOne({ _id: id })
  .exec((err, worker) => {
    console.log(worker);
    assert.equal(null, err);
    worker? worker.roles.push(role) : console.info("worker not found")
    worker.save();
  })
};

/**
 * @function  [setWorkerTimeOff]
 * @returns {String} Status
 */
const setWorkerTimeOff = (id, timeoff) => {
  db.models.Worker.findOne({ _id: id })
  .exec((err, worker) => {
    assert.equal(null, err);
    worker? worker.roles.push(role) : console.info("worker not found")
    worker.timeoff.push(timeoff);
  })
};

// Export all methods
module.exports = {  addWorker, getWorker, listWorkers, setWorkerRole, setWorkerTimeOff };