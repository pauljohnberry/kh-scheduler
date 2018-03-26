const db = require('../helpers/db'); 
const assert = require('assert'); 
const rc = require('../controllers/role'); 

// Public functions
/**
 * @function  [addWorker]
 * @returns {String} Status
 */
const addWorker = (worker, roles) => {
  return new Promise((resolve, reject) => {
    rc.getRolesByName(roles).then(function (roles) {
      worker.roles = roles;
      resolve(db.execute(() => createWorker(worker)));
    });
  });
};

/**
 * @function  [getWorkersByName]
 * @returns {Json} workers
 */
const getWorkersByName = (name) => {
  return db.execute(() => findWorkersByName(name));
}

/**
 * @function  [listWorkers]
 * @returns {Json} workers
 */
const listWorkers = () => {
  return db.execute(() => findAllWorkers());
};

/**
 * @function  [setWorkerRole]
 * @returns {String} Status
 */
const setWorkerRole = (id, role) => {
  return db.execute(() => saveWorkerRole(id, role))
};

/**
 * @function  [setWorkerTimeOff]
 * @returns {String} Status
 */
const setWorkerTimeOff = (id, timeoff) => {
  return db.execute(() => saveWorkerTimeOff(id, timeoff))
};

// Private functions
function createWorker(worker) {
  return new Promise((resolve, reject) => { 
    db.models.Worker.create(worker, (err, w) => {
      if (err === null) {
        resolve('worker added');
      }
      else {
        reject(false);
      }
    });
  });
}

function findAllWorkers() {
  return new Promise((resolve, reject) => { 
    db.models.Worker.find().exec((err, workers) => {
      if (err === null) {
        if (workers.length < 1) {
          resolve("No workers found");
        }
        resolve(workers + "\r\n\r\n" + workers.length + " workers found");
      }
      else {
        reject(false);
      }
    });
  });
}

function saveWorkerRole(id, role) {
  i = id;
  r = role;
  return new Promise((resolve, reject) => { 
    db.models.Worker.findOne({ _id: i }).exec((err, worker) => {
      if (err === null) {
        worker? worker.roles.push(r) : resolve("worker not found")
        worker.save();
        resolve('worker role added');
      }
      else {
        reject(false);
      }
    });
  });
}

function saveWorkerTimeOff(id, timeoff) {
  i = id;
  t = timeoff;
  return new Promise((resolve, reject) => { 
    db.models.Worker.findOne({ _id: i }).exec((err, worker) => {
      if (err === null) {
        worker? worker.timeoff.push(t) : resolve("worker not found")
        worker.save();
        resolve('worker time off added');
      }
      else {
        reject(false);
      }
    });
  });
};

function findWorkersByName(name) {
  const search = new RegExp(name, 'i');
  return new Promise((resolve, reject) => { 
    db.models.Worker.find({$or: [{firstname: search }, {lastname: search }]}).exec((err, workers) => {
      if (err === null) {
        if (workers.length < 1) {
          resolve("No matches found");
        }
        resolve(workers + "\r\n\r\n" + workers.length + " matches found");
      }
      else {
        reject(false);
      }
    });
  });
};

// Export all methods
module.exports = { addWorker, getWorkersByName, listWorkers, setWorkerRole, setWorkerTimeOff };