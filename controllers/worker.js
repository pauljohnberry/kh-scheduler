const db = require('../helpers/db'); 
const assert = require('assert'); 

// Public functions
/**
 * @function  [addWorker]
 * @returns {String} Status
 */
const addWorker = (worker, roles) => {
  return new Promise((resolve, reject) => {
    db.rm.role.find({ role: { $in: roles } }).exec((err, response) => {
      worker.roles = response;
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
 * @function  [getWorkersRoles]
 * @returns {Json} roles
 */
const getWorkerRoles = (id) => {
  return db.execute(() => findRolesForWorker(id));
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
 * @function  [setWorkerRoles]
 * @returns {String} Status
 */
const setWorkerRoles = (id, roles) => {
  return db.execute(() => saveWorkerRoles(id, roles))
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
    db.wm.worker.create(worker, (err, w) => {
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
    db.wm.worker.find().exec((err, workers) => {
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

function findRolesForWorker(id) {
  return new Promise((resolve, reject) => { 
    db.wm.worker.find({_id: id}).exec((err, worker) => {
      if (err === null) {
        if (worker.length < 1) {
          resolve("Worker not found");
        }
        resolve(worker[0].roles);
      }
      else {
        reject(false);
      }
    });
  });
}

function saveWorkerRoles(id, roles) {
  i = id;
  rs = roles;
  return new Promise((resolve, reject) => {
    db.rm.role.find({ role: { $in: roles } }).exec((err, response) => {
      db.wm.worker.findOneAndUpdate({ _id: i}, { roles: response }).exec((err, worker) => {
        if (err === null) {
          resolve('worker roles updated');
        }
        else {
          reject(false);
        }
      })
    });
  });
}

function saveWorkerRole(id, role) {
  i = id;
  r = role;
  return new Promise((resolve, reject) => { 
    db.wm.worker.findOne({ _id: i }).exec((err, worker) => {
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
    db.wm.worker.findOne({ _id: i }).exec((err, worker) => {
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
    db.wm.worker.find({$or: [{firstname: search }, {lastname: search }]}).exec((err, workers) => {
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
module.exports = { addWorker, getWorkersByName, listWorkers, setWorkerRole, setWorkerTimeOff, setWorkerRoles, getWorkerRoles };