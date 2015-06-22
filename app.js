var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config.json');
var jwt = require('jwt-simple');
var secret = config.secret;

// http://knexjs.org/
// SQL query builder
var knex = require('knex')({
	client: 'mysql',
	connection: config.database
});

// http://expressjs.com/
// Web framework for nodejs
var app = express();
var router = express.Router();
var port = process.env.PORT || 8080;

// body parser module
// parses url-encoded and json payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// JSON web token verification for API usage.
// Use config/generateToken.js to create API token.
app.use(function (req, res, next) {
	// token should be provided in Authorization header
	console.log(req.headers)
	var decoded = jwt.decode(req.headers.authorization, secret);
	if (decoded && decoded.api) {
		next();
	} else {
		res.status(401).send('Authorization failed');
	}
});

// store knex connection in app object
app.set('knex', knex);

// models
var admin = require('./lib/admin')(app);
var answers = require('./lib/answers')(app);
var articles = require('./lib/articles')(app);
var info = require('./lib/information')(app);
var login = require('./lib/login')(app);
var questions = require('./lib/questions')(app);
var users = require('./lib/users')(app);


// routes
// router.use(function(req, res, next) {
// 	console.log('alert');
// 	next();
// });

router.get('/', function(req, res) {
	res.json({ message: 'hello world' });
});

// users
router.route('/users')
	// create user
	.post(users.create)
	// list users
	.get(users.list);

// user
router.route('/users/:user_id')
	// show user
	.get(users.show)
	// update user
	.put(users.update)
	// remove user
	.delete(users.remove);

// login
router.route('/login')
	.post(login.login);


// register routes
app.use('/api', router);


app.listen(port);
console.log('Golden Leaf started on port ' + port);
