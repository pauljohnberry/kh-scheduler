const mongoose = require('mongoose');
const sf = require('../helpers/string-functions');
const wm = require('./worker');

// Define a schedule item Schema
const schema = mongoose.Schema({
    datestart: { type: Date },
    dateend: { type: Date },
    workers: [wm.schema]
  });
  
const scheduleItem = mongoose.model('ScheduleItem', schema);

module.exports = { scheduleItem, schema };