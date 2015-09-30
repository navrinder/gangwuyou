var http = require('http');
var https = require('https');
var express = require('express');
var fs = require('fs');
var morgan = require('morgan');
var path = require('path');

// http://expressjs.com/
// Web framework for nodejs
var app = express();
var port = process.env.PORT || 8080;
// The environment variable NODE_ENV must be set to 'production',
// otherwise express defaults to 'development'.
process.env.NODE_ENV = app.get('env');
var config = require('./config')[app.get('env')];
app.set('config', config);

// SSL certificate check
var sslOptions = {};
if (config.ssl.key) {
	try {
		sslOptions.key = fs.readFileSync(config.ssl.key);
	} catch (e) {
		console.error(e);
	}
}
if (config.ssl.cert) {
	try {
		sslOptions.cert = fs.readFileSync(config.ssl.cert);
	} catch (e) {
		console.error(e);
	}
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');
app.engine('mustache', require('hogan-express'));

// KnexJS and BookshelfJS are used to access
// the MySQL database. These modules use promises
// instead of callbacks.

// http://knexjs.org/
// SQL query builder
var knex = require('knex')({
	client: 'mysql',
	connection: config.database
});
// http://bookshelfjs.org/
// ORM with knexjs
var bookshelf = require('bookshelf')(knex);
// store knex connection in app object so it can be
// accessed in the models
app.set('Bookshelf', bookshelf);

// functions called in routes
var middleware = require('./middleware')(app);
app.use(express.static(__dirname + '/public'));

// basic logging
app.use(morgan('combined'));

// register routes
// all routes must start with "/api/v1"
app.use('/api/v:version', function (req, res, next) {
	var version = app.get('config').version;
	if (req.params.version == version) {
		middleware.routes['v' + version](req, res, next);
	} else {
		next({
			status: 410,
			code: 'DEPRECATED',
			message: 'The API version is deprecated or does not exist.'
		});
	}
});

// views
app.use(middleware.routes.views);

// scripts
app.use('/scripts/js-cookie', express.static(__dirname + '/node_modules/js-cookie'));

// error handler
app.use(function (err, req, res, next) {
	var response = {
		success: false,
		code: err.code,
		message: err.message || 'Error'
	};

	console.error(err.message);
	console.error(err.stack);

	if (err.message && err.code) {
		var readable = err.message.split(err.code + ':');
		if (readable.length > 1) {
			response.message = readable[1].trim();
		}

	}

	res.status(err.status || 400).json(response);
});

// start server
app.listen(port);
if (sslOptions.key && sslOptions.cert) {
	http.createServer(app).listen(80);
	https.createServer(sslOptions, app).listen(443);
}
console.log('Golden Leaf running in %s mode on port %d', app.get('env'), port);
