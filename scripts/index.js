exports.hashToString = function (hash) {
  var string = "{";
  Object.keys(hash).forEach(function (key) {
    string += key;
    string += ":";
    if (typeof hash[key] == 'string') {
      string = string + "'" + hash[key] + "'";
    } else {
      string += String(hash[key]);
    }
    string += ",";
  });
  string = string.slice(0, -1) + "}"
  return string;
}
