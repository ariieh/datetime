var request = require('request');
var app = require('../app');
var fbApiVersion = app.get('FB_API_VERSION');
var fbURL = 'https://graph.facebook.com/'
var fbGraphAPI = module.exports;

function auth (token) {
  return "?access_token=" + token;
}

fbGraphAPI.userLikes = function (userID, accessToken, callback) {
  console.log(fbURL + fbApiVersion + '/' + userID + '/likes' + auth(accessToken));
  request({
    url: fbURL + fbApiVersion + '/' + userID + '/likes' + auth(accessToken),
    method: 'GET'
  }, function(error, response, body) {
    var likes = JSON.parse(body);
    if (callback) callback(error, likes);
  });
}
