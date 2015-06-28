var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config.json');
var jwt = require('jwt-simple');

var secret = config.secret;

// auth middleware is used to verify the caller's permission
// in addition to the API token. Include the scope string
// as the argument to test.
var auth = require('./middleware/auth');

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
var nodeEnv = process.env.NODE_ENV;
var port = process.env.PORT || 8080;

// store knex connection in app object so it can be
// accessed in the models
app.set('knex', knex);
app.set('config', nodeEnv === 'production' ? config.production : config.development);
// body parser module
// parses url-encoded and json payloads
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// JSON web token verification for API usage.
// Use config/generateToken.js to create API token.
// this function will be called on every request, so an API
// user MUST have an API token.
app.use(function (req, res, next) {
	// token should be provided in Authorization header
	var decoded;
	// set environment variable NODE_ENV=development to disable API auth
	if (nodeEnv !== 'development') {
		if (req.headers.authorization) {
			decoded = jwt.decode(req.headers.authorization, secret);
		}
		if (decoded && decoded.api) {
			return next();
		} else {
			return res.status(401).send('Authorization failed');
		}
	} else {
		next();
	}
});



// models
var admin = require('./models/admin')(app);
var answers = require('./models/answers')(app);
var articles = require('./models/articles')(app);
var info = require('./models/information')(app);
var login = require('./models/login')(app);
var questions = require('./models/questions')(app);
var users = require('./models/users')(app);


// test route
router.get('/', function(req, res) {
	res.json({ message: 'hello world' });
});


// admin
router.route('/verify/:user_id')
	// verify account
	.post(auth('admin'), admin.verifyAccount);

// answers
router.route('/answers')
	// list answers
	.get(auth(['admin']), answers.list);

// answer
router.route('/answers/:user_id')
	// show answer
	.get(auth(['user', 'admin']), answers.show)
	// add answer
	.post(auth(['user', 'admin']), answers.create)
	// update answer
	.put(auth(['user', 'admin']), answers.update)
	// remove answer
	.delete(auth(['admin']), answers.remove);

// articles
router.route('/articles')
	// list articles
	.get(articles.list)
	// create article
	.post(auth(['admin']), articles.create);

// article
router.route('/articles/:article_id')
	// show article
	.get(articles.show)
	// update article
	.put(auth(['admin']), articles.update)
	// remove article
	.delete(auth(['admin']), articles.remove);

// static info
router.route('/information')
	// TODO
	.get(function(req, res) {
		res.status(200).send('Infomration placeholder');
	});

// login
router.route('/login')
	.post(login.login);

// questions
router.route('/questions')
	// list questions
	.get(questions.list)
	// add question
	.post(auth(['admin']), questions.create);

// question
router.route('/questions/:question_id')
	// show question
	.get(questions.show)
	// update question
	.put(auth(['admin']), questions.update)
	// remove question
	.delete(auth(['admin']), questions.remove);

// users
router.route('/users')
	// create user
	.post(users.create)
	// list users
	.get(auth(['admin']), users.list);

// user
router.route('/users/:user_id')
	// show user
	.get(auth(['user', 'admin']), users.show)
	// update user
	.put(auth(['user', 'admin']), users.update)
	// remove user
	.delete(auth(['admin']), users.remove);


// register routes
// all routes must start with "/api"
app.use('/api', router);

// error handlers
app.use(function (err, req, res, next) {
	console.error(err.stack);
	if (err.message) {
		res.status(err.status || 400).send(err.message);
	} else {
		res.status(400).end();
	}
});


app.listen(port);
console.log('Golden Leaf running in %s mode on port %d', nodeEnv, port);
