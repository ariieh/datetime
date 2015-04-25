var express = require('express');
var app = module.exports = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var env = require('node-env-file');
var helpers = require('./scripts');

// Express config
app.set('port', process.env.PORT || 3000);
app.set('NEO4J_URL', process.env['NEO4J_URL'] || process.env['GRAPHENEDB_URL'] || 'http://localhost:7474');
app.set('FB_API_VERSION', 'v2.3');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
if ('development' == app.get('env')) app.use(errorHandler());
app.set('view engine', 'jade');
app.set('helpers', helpers);

// Load local environment variables
env(__dirname + '/.env');

// Routes
var routes = require('./routes');
app.get('/', routes.views.home);
app.post('/users', routes.users.create);
app.use(express.static(__dirname + '/public'));

// Start server
app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});
