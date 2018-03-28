const mongoose = require('mongoose');
const sf = require('../helpers/string-functions');
const wm = require('./worker');
const sim = require('./schedule-item');

// Define a schedule Schema
const schema = mongoose.Schema({
  month: { type: String },
  type: { type: String, set: sf.toLower },
  items: [sim.schema]
});

const schedule = mongoose.model('Schedule', schema);

module.exports = { schedule, schema };