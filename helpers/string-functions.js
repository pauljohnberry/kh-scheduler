// Converts value to lowercase
const toLower = function toLower(v) {
    if (v != null ) {
        return v.toLowerCase();
    }
    else {
        return v;
    }
};
  
const toSentenceCase = function toSentenceCase(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

module.exports = { toLower, toSentenceCase };