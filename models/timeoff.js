const db = require('../helpers/db');

// Define a timeOff Schema
const schema = db.mongoose.Schema({
    datestart: { type: Date },
    dateend: { type: Date }
  });

const timeoff = db.mongoose.model('TimeOff', schema);

module.exports = { timeoff, schema };