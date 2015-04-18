var express = require('express');
var app = module.exports = express();
var routes = require('./routes');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var path = require('path');

// Express config
app.set('port', process.env.PORT || 3000);
app.set('NEO4J_URL', process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] || 'http://localhost:7474');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
if ('development' == app.get('env')) app.use(errorHandler());

// Routes
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});
