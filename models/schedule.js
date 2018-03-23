const db = require('../helpers/db');
const sf = require('../helpers/string-functions');
const wm = require('./worker');
const sim = require('./schedule-item');

// Define a schedule Schema
const schema = db.mongoose.Schema({
  month: { type: String },
  type: { type: String, set: sf.toLower },
  items: [sim.schema]
});

const schedule = db.mongoose.model('Schedule', schema);

module.exports = { schedule, schema };