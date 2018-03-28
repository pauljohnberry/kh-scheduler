const mongoose = require('mongoose');

// Define a timeOff Schema
const schema = mongoose.Schema({
    datestart: { type: Date },
    dateend: { type: Date }
  });

const timeoff = mongoose.model('TimeOff', schema);

module.exports = { timeoff, schema };