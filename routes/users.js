var User = require('../models/user')

exports.create = function(req, res, next) {
  console.log(req["body"]);
}
