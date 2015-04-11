var express = require('express');
var app = express();
var routes = require('./routes');

// Express config
app.set('port', process.env.PORT || 3000);

// Routes
app.post('/users', routes.users.create);

// Start server
app.listen(app.get('port'), function() {
  console.log('Listening on port ' + app.get('port'));
});
