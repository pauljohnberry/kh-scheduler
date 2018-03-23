const db = require('../helpers/db');
const sf = require('../helpers/string-functions');

// Define a role Schema
const schema = db.mongoose.Schema({
    role: { type: String, set: sf.toLower }
  });

const role = db.mongoose.model('Role', schema);

module.exports = { role, schema };