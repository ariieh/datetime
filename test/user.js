var expect = require('chai').expect;
var User = require('../models/user');

// Helpers:
function expectUser(obj, user) {
  expect(obj).to.be.an('object');
  expect(obj).to.be.an.instanceOf(User);

  if (user) {
    ['id', 'name'].forEach(function (prop) {
        expect(obj[prop]).to.equal(user[prop]);
    });
  }
}

describe('Adding to a spatial index', function () {
  var user_id, user_lat, user_lon, user_name;

  it('creates a user', function (next) {
    var node = {
      name: 'Ari',
      lat: 36.985003,
      lon: -81.562500
    }

    User.create(node, function (error, user) {
      expectUser(user);
      user_id = user.id;
      user_lat = user.lat;
      user_lon = user.lon;
      user_name = user.name;

      expect(user_id).to.be.a('number');
      expect(user_lat).to.be.equal(36.985003);
      expect(user_lon).to.be.equal(-81.562500);
      expect(user_name).to.be.equal('Ari');

      return next();
    });
  });

  it('creates a spatial point layer', function (next) {
    User.createSimplePointLayer(function (error, response, body) {
      expect(body[0]["data"]["layer"]).to.be.equal('user');
      return next();
    });
  });

  it('creates a spatial index', function (next) {
    User.createSpatialIndex({}, function (error, response, body) {
      expect(body["provider"]).to.be.equal('spatial');
      expect(body["geometry_type"]).to.be.equal('point');
      return next();
    });
  });

  it('adds a node to the spatial layer and updates for spatial index', function (next) {
    User.addNodeToSpatialLayer(user_id, function(error, results) {
      expect(error).to.be.a('null');
      return next();
    })
  });

  it('can query by location', function (next) {
    User.findByLocation(user_lat, user_lon, 10, function(error, users) {
      users.forEach(function(user) {
        expectUser(user);
        expect(user.lat).to.be.equal(user_lat);
        expect(user.lon).to.be.equal(user_lon);
      });
    });
    return next();
  });
});
