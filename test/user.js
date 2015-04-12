// Cribbing a bit from: https://github.com/aseemk/node-neo4j-template/blob/master/test/models/user.js

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

describe('User', function () {
  it('creates a user', function (next) {
    User.create({name: 'Ari'}, function (err, user) {
      expectUser(user);
      expect(user.id).to.be.a('number');
      expect(user.name).to.be.equal('Ari');

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
});
