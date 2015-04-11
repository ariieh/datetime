// Cribbing a bit from: https://github.com/aseemk/node-neo4j-template/blob/master/test/models/user.js

var expect = require('chai').expect;
var User = require('../models/user');

// Helpers:

/**
 * Asserts that the given object is a valid user model.
 * If an expected user model is given too (the second argument),
 * asserts that the given object represents the same user with the same data.
 */
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
      if (err) return next(err);

      expectUser(user);
      expect(user.id).to.be.a('number');
      expect(user.name).to.be.equal('Ari');

      return next();
    });
  });
});
