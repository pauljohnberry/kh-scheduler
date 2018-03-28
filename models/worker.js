const mongoose = require('mongoose');
const rm = require('./role');
const tom = require('./timeoff');
const sf = require('../helpers/string-functions');

// Define a worker Schema
const schema = mongoose.Schema({
    firstname: { type: String, set: sf.toLower },
    lastname: { type: String, set: sf.toLower },
    phone: { type: String, set: sf.toLower },
    email: { type: String, set: sf.toLower },
    roles: [rm.schema],
    timeoff: [tom.schema],
  });

const worker = mongoose.model('Worker', schema);

module.exports = { worker, schema };