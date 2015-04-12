// Model setup
var app = require('../app')
var request = require('request');
var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(app.get('NEO4J_URL'));

var User = module.exports = function User(node) {
    this.node = node;
}

// Define accessible node properties and ID
var nodeProperties = ['name', 'lat', 'lon'];

nodeProperties.forEach(function(nodeProperty) {
  Object.defineProperty(User.prototype, nodeProperty, {
    get: function () { return this.node.properties[nodeProperty]; },
    set: function (name) { this.node.properties[nodeProperty] = nodeProperty; }
  });
});

Object.defineProperty(User.prototype, 'id', {
  get: function() { return this.node._id; }
});

// User class functions
User.create = function (data, callback) {
	db.cypher({
	  query: 'CREATE (user:User {data}) RETURN user',
	  params: {
      data: data
    }
	}, function (error, results) {
      var user;
	    if (!error) user = new User(results[0]['user']);
      if (callback) callback(error, user);
	});
};

User.createSpatialIndex = function (data, callback) {
  data = {
    "name" : "user",
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
    if (callback) callback(error, response, body);
  });
};

User.addNodeToSpatialIndex = function(properties, callback) {
  request({
    url: app.get('NEO4J_URL') + '/db/data/node/',
    method: 'POST',
    json: properties
  }, function(error, response, body) {
    if (callback) callback(error, response, body);
  });
};
