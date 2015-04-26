var app = require('../app');
var request = require('request');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(app.get('NEO4J_URL'));
var fbGraphApi = require('../scripts/fb_graph_api');

var dbModelName = "UserLike";
var dbRelationshipName = "LIKES";

var UserLike = module.exports = function User(node) {
    this.node = node;
}

UserLike.createFBLikesForUser = function (user, callback) {
  var fbUserID = user.node.properties.id;

  fbGraphApi.userLikes(fbUserID, user.accessToken, function (error, results) {
    UserLike.createLikes(fbUserID, results.data, callback);
  });
}

UserLike.createLikes = function(userID, likes, callback) {
  // TODO: What about people with no likes?
  var matchUser = "MATCH (user {id:'" + userID + "'})\n";

  var createUserLikes = likes.map(function (userLike) {
    var data = {
      category: userLike.category,
      name: userLike.name,
      id: userLike.id,
      created_time: userLike.created_time
    }
    return "MERGE (like" + userLike.id + ":" + dbModelName + " " + app.get('helpers').hashToString(data) + ")";
  }).join("\n") + "\n";

  var createUserRelationships = "CREATE " + likes.map(function (userLike) {
    return "(user)-[:" + dbRelationshipName + "]->(like" + userLike.id + "),";
  }).join("\n").slice(0, -1);

  var query = matchUser + createUserLikes + createUserRelationships;

  db.cypher({ query: query }, function (error, results) {
    if (callback) callback(error, results);
  });
};

UserLike.findLikes = function(userID, callback) {
  var query = "MATCH (u:User {id:'" + userID + "'}) - [:LIKES]-> l RETURN l;"

  db.cypher({ query: query }, function (error, results) {
    if (callback) callback(error, results);
  });
};
