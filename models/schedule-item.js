const db = require('../helpers/db');
const sf = require('../helpers/string-functions');
const wm = require('./worker');

// Define a schedule item Schema
const schema = db.mongoose.Schema({
    datestart: { type: Date },
    dateend: { type: Date },
    workers: [wm.schema]
  });
  
const scheduleItem = db.mongoose.model('ScheduleItem', schema);

module.exports = { scheduleItem, schema };