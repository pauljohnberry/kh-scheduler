const db = require('../helpers/db'); 
const assert = require('assert'); 

// Public
/**
 * @function  [addRole]
 * @returns {String} Status
 */
const addRole = (role) => {
  db.execute(() => createRole(role));
};

/**
 * @function  [listRoles]
 * @returns {Json} roles
 */
const listRoles = () => {
  return db.execute(() => getAllRoles());
}

/**
 * @function  [getRole]
 * @returns {Json} role
 */
const getRole = (id) => {
  db.models.Role.findOne({ _id: id })
  .exec((err, role) => {
    assert.equal(null, err);
    db.mongoose.disconnect(); 
  });
};

/**
 * @function  [getRoleByName]
 * @returns {Json} role
 */
const getRoleByName = (name) => {
  return new Promise((resolve, reject) => { 
    db.models.Role.findOne({ role: name })
    .exec((err, role) => {
      assert.equal(null, err);
      db.mongoose.disconnect()
      resolve(role);
    });
  });
};

/**
 * @function  [getRolesByName]
 * @returns {Json} roles
 */
const getRolesByName = (names) => {
  return new Promise((resolve, reject) => { 
    rolesToReturn = []
    db.connect()
    db.models.Role.find({ role: { $in: names } })
    .exec((err, roles) => {
      assert.equal(null, err);
      roles.forEach(r => {
        rolesToReturn.push(r);
      });
      db.disconnect(); 
      resolve(rolesToReturn);
    })
  });
};

// Private
function getAllRoles() {
  return new Promise((resolve, reject) => { 
    db.models.Role.find().exec((err, roles) => {
      if (err === null) {
        resolve(roles);
      }
      else {
        reject(false);
      }
    });
  })
};

function createRole(role) {
  return new Promise((resolve, reject) => { 
    db.models.Role.create(role, (err, w) => {
      if (err === null) {
        resolve('New role added');
      }
      else {
        reject(false);
      }
    });
  })
} 

// Export all methods
module.exports = {  addRole, listRoles, getRole, getRoleByName, getRolesByName };