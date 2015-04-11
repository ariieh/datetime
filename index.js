var express = require('express');
var app = express();
var routes = require('./routes');
var logger = require('morgan');

// Express config
app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));

// Routes
app.post('/users', routes.users.create);

// Start server
app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});
