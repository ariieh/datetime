var app = require('../app')
var request = require('request');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(app.get('NEO4J_URL'));

var User = module.exports = function User(node) {
    this.node = node;
}

Object.defineProperty(User.prototype, 'id', {
	get: function() { return this.node._id; }
});

Object.defineProperty(User.prototype, 'name', {
  get: function () { return this.node.properties['name']; },
  set: function (name) { this.node.properties['name'] = name; }
});

User.create = function (data, callback) {
	db.cypher({
	  query: 'CREATE (user:User {data}) RETURN user',
	  params: {
      data: data
    }
	}, function (err, results) {
	    if (err) throw err;
      var user = new User(results[0]['user']);
      callback(null, user);
	});
};

User.createSpatialIndex = function (data, callback) {
  data = {
    "name" : data["name"] || "user",
    "config" : {
      "provider" : data["provider"] || "spatial",
      "geometry_type" : data["geometry_type"] || "point",
      "lat" : data["lat"] || "lat",
      "lon" : data["lon"] || "lon"
    }
  }

  request({
    url: app.get('NEO4J_URL') + '/db/data/index/node/',
    method: 'POST',
    json: data
  }, function(error, response, body) {
    callback(error, response, body);
  });
};
