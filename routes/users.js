var User = require('../models/user');
var UserLike = require('../models/user_like');

exports.create = function(req, res, next) {
  var fbUser = req["body"]["fbUser"];
  fbUser["lat"] = req["body"]["lat"];
  fbUser["lon"] = req["body"]["lon"];
  delete fbUser["education"];
  delete fbUser["quotes"];

  User.updateOrCreate(fbUser["id"], fbUser, function(error, user) {
    UserLike.createFBLikesForUser(user);
  });
}
