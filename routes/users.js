var User = require('../models/user');
var fbGraphApi = require('../scripts/graph_api');

exports.create = function(req, res, next) {
  var fbUser = req["body"]["fbUser"];
  fbUser["lat"] = req["body"]["lat"];
  fbUser["lon"] = req["body"]["lon"];
  delete fbUser["education"];
  delete fbUser["quotes"];

  User.create(fbUser, function(error, user) {
    fbGraphApi.userLikes(user.node.properties["id"], user.accessToken);
  });
}
