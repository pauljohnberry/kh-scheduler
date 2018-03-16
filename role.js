const mongoose = require('mongoose'); // An Object-Document Mapper for Node.js
const assert = require('assert'); // N.B: Assert module comes bundled with Node.js.

// Converts value to lowercase
function toLower(v) {
  return v.toLowerCase();
};

// Define a role Schema
const roleSchema = mongoose.Schema({
  firstname: { type: String, set: toLower },
  lastname: { type: String, set: toLower },
  role: { type: String, set: toLower }
});

// Define model as an interface with the database
const Role = mongoose.model('Role', roleSchema);

/**
 * @function  [addRole]
 * @returns {String} Status
 */
const addRole = (role) => {
  Role.create(role, (err) => {
    assert.equal(null, err);
    console.info('New role added');
    mongoose.disconnect();
  });
};

/**
 * @function  [getRole]
 * @returns {Json} roles
 */
const getRole = (name) => {
  // Define search criteria. The search here is case-insensitive and inexact.
  const search = new RegExp(name, 'i');
  Role.find({$or: [{firstname: search }, {lastname: search }]})
  .exec((err, role) => {
    assert.equal(null, err);
    console.info(role);
    console.info(`${role.length} matches`);
    mongoose.disconnect();
  });
};

// Export all methods
module.exports = {  addRole, getRole };