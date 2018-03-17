const mongoose = require('mongoose');

// Converts value to lowercase
function toLower(v) {
    return v.toLowerCase();
};
  
// Define a role Schema
const roleSchema = mongoose.Schema({
    role: { type: String, set: toLower }
  });

const Role = mongoose.model('Role', roleSchema);

module.exports = { Role };