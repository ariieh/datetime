var express = require('express');
var app = express();
var routes = require('./routes');
var logger = require('morgan');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');

// Express config
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.post('/users', routes.users.create);

// Error handling
if ('development' == app.get('env')) {
  app.use(errorHandler());
}

// Start server
app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});
