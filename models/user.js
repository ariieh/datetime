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

User.create = function(data, callback) {
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

// Spatial stuff

User.findByLocation = function(lat, lon, distance, callback) {
  var lat = lat.toFixed(2);
  var lon = lon.toFixed(2);
  var distance = distance.toFixed(1);

  db.cypher({
    query: 'START n = node:user({location}) return n',
    params: {
      location: "withinDistance:[" + lat + "," + lon + "," + distance + "]"
    }
  }, function (error, results) {
      var users = [];
      results.forEach(function (result) {
        var user = new User(result["n"]["properties"]);
        users.push(user);
      });
      if (callback) callback(error, users);
  });
}

User.createSpatialIndex = function (data, callback) {
  indexData = {
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
    json: indexData
  }, function(error, response, body) {
    if (callback) callback(error, response, body);
  });
}

User.createSimplePointLayer = function (callback) {
  layerData = {
    "layer": "user",
    "lat": "lat",
    "lon": "lon"
  }

  request({
    url: app.get('NEO4J_URL') + '/db/data/ext/SpatialPlugin/graphdb/addSimplePointLayer/',
    method: 'POST',
    json: layerData
  }, function(error, response, body) {
    if (callback) callback(error, response, body);
  });
};

User.addNodeToSpatialLayer = function(id, callback) {
  var updateNodeIDForIndex = function (id) {
    // Necessary thanks to Neo4j: http://stackoverflow.com/a/24700885/4062306
    db.cypher({
      query: 'START n = node(' + id + ') SET n.id = id(n)'
    }, function (error, results) {
      if (callback) callback(error, results)
    });
  }

  data = {
    "layer": "user",
    "node": app.get('NEO4J_URL') + '/db/data/node/' + id
  }

  request({
    url: app.get('NEO4J_URL') + '/db/data/ext/SpatialPlugin/graphdb/addNodeToLayer',
    method: 'POST',
    json: data
  }, function(error, response, body) {
    var user_id = body[0]["metadata"]["id"];
    updateNodeIDForIndex(user_id);
  });
};
