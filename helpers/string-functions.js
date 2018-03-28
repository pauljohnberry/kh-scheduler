// Converts value to lowercase
const toLower = function toLower(v) {
    if (v != null ) {
        return v.toLowerCase();
    }
    else {
        return v;
    }
};
  
module.exports = { toLower };