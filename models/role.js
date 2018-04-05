const mongoose = require('mongoose');
const sf = require('../helpers/string-functions');

// Define a role Schema
const schema = mongoose.Schema({
    role: { type: String, set: sf.toLower },
    workersneeded: { type: Number }
  });

const role = mongoose.model('Role', schema);

module.exports = { role, schema };