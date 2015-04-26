var expect = require('chai').expect;
var User = require('../models/user');
var UserLike = require('../models/user_like');
var expect = require('chai').expect;

describe('User likes', function () {

  var mochipet = {
    category: 'Musician/band',
    name: 'Mochipet',
    id: '203654143454',
    created_time: '2013-01-06T19:55:19+0000'
  }
  var manousheh = {
    category: 'Restaurant/cafe',
    name: 'Manousheh NYC',
    id: '1379440182285854',
    created_time: '2013-09-28T15:31:57+0000'
  }
  var kamakura = {
    category: 'Clothing',
    name: 'Kamakura Shirts New York',
    id: '400553380019033',
    created_time: '2013-12-16T23:09:45+0000'
  }
  var therise = {
    category: 'Organization',
    name: 'The Rise',
    id: '152009431660640',
    created_time: '2014-01-16T00:33:08+0000'
  }
  var likes = [mochipet, manousheh, kamakura, therise];

  it('creates likes as nodes', function (next) {
    var id = String(Math.floor((Math.random() * 1000000) + 1));
    var node = {
      name: 'Ari',
      id: id
    }

    User.create(node, function (error, user) {
      UserLike.createLikes(id, likes, function (error, results) {
        UserLike.findLikes(id, function (error, results) {
          expect(results.length).to.be.equal(4);
          return next();
        });
      });
    });
  });

});
