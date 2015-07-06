var express = require('express');
var bodyParser = require('body-parser');

var nodeEnv = process.env.NODE_ENV;
var config = require('./config')[nodeEnv || 'development'];


// http://knexjs.org/
// SQL query builder
var knex = require('knex')({
	client: 'mysql',
	connection: config.database
});

// http://expressjs.com/
// Web framework for nodejs
var app = express();
var port = process.env.PORT || 8080;

// store knex connection in app object so it can be
// accessed in the models
app.set('knex', knex);
app.set('config', config);

var middleware = require('./middleware')(app);
var models = require('./models')(app);

// auth middleware is used to verify the caller's permission
// in addition to the API token. Include the scope string
// as the argument to check.
var authUser = middleware.authUser;



// body parser module
// parses url-encoded and json payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// JSON web token verification for API usage.
// Use ./scripts/generateToken.js to create API token.
// This function will be called on every request, so an API
// user MUST have an API token. Setting the NODE_ENV=development
// will disable this check.
app.use(middleware.authApi);

// Both API and user tokens should be included in the Authorization
// header, comma separated with API token first and user token second.

// test route
app.get('/', function(req, res) {
	res.json({ message: 'hello world' });
});


// register routes
// all routes must start with "/api/v1"
app.use('/api/v1', middleware.routes.v1);

// error handler
app.use(function (err, req, res, next) {
	console.error(err.stack);
	var response = {
		success: false,
		message: err.message || 'Error'
	};

	res.status(err.status || 400).json(response);
});


app.listen(port);
console.log('Golden Leaf running in %s mode on port %d', nodeEnv, port);
