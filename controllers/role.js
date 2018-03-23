const db = require('../helpers/db'); 
const assert = require('assert'); 
const rm = require('../models/role');

/**
 * @function  [addRole]
 * @returns {String} Status
 */
const addRole = (role) => {
  db.connect();
  db.models.Role.create(role, (err) => {
    assert.equal(null, err);
    console.info('New role added');
    db.disconnect();
  });
};

/**
 * @function  [listRoles]
 * @returns {Json} roles
 */
const listRoles = () => {
  db.execute(() =>
    db.models.Role.find()
    .exec((err, role) => {
      assert.equal(null, err);
      console.info(role);
      console.info(`${role.length} matches`);
    })
  );
};

/**
 * @function  [getRole]
 * @returns {Json} role
 */
const getRole = (id) => {
  rm.role.findOne({ _id: id })
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
    db.mongoose.models.Role.findOne({ role: name })
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


// Export all methods
module.exports = {  addRole, listRoles, getRole, getRoleByName, getRolesByName };