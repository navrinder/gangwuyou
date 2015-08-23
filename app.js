var express = require('express');
var bodyParser = require('body-parser');
var markdown = require('markdown').markdown;
var fs = require('fs');

// http://expressjs.com/
// Web framework for nodejs
var app = express();
var port = process.env.PORT || 8080;
// The environment variable NODE_ENV must be set to 'production',
// otherwise express defaults to 'development'.
process.env.NODE_ENV = app.get('env');
var config = require('./config')[app.get('env')];
app.set('config', config);


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

// body parser module
// parses url-encoded and json payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// basic logging
app.use(function (req, res, next) {
	console.log(req.method, req.url);
	if (app.get('env') === 'development') {
		console.log(req.body);
	}
	next();
});

// test route
app.get('/', function(req, res) {
	res.json({ message: 'hello world' });
});

// documentation
app.get('/readme', function (req, res) {
	res.status(200).send(markdown.toHTML(fs.readFileSync('./README.md', { encoding: 'utf8' })));
});


// register routes
// all routes must start with "/api/v1"
app.use('/api/v1', middleware.routes.v1);

// error handler
app.use(function (err, req, res, next) {
	var response = {
		success: false,
		code: err.code,
		message: 'Error'
	};

	console.error(err.message);
	console.error(err.stack);

	if (app.get('env') === 'development') {
		response.message = err.message;
	}

	res.status(err.status || 400).json(response);
});

// start server
app.listen(port);
console.log('Golden Leaf running in %s mode on port %d', app.get('env'), port);
