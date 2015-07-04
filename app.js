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
var router = express.Router();
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
router.get('/', function(req, res) {
	res.json({ message: 'hello world' });
});


// admin
router.route('/verify/:user_id')
	// verify account
	.post(authUser('admin'), models.admin.verifyAccount);


// answer
router.route('/users/:user_id/answers')
	// show answers
	.get(authUser(['user', 'admin']), models.answers.show)
	// add answer to user
	.post(authUser(['user', 'admin']), models.answers.updateAnswers);

// articles
router.route('/articles')
	// list articles
	.get(models.articles.list)
	// create article
	.post(authUser(['admin']), models.articles.create);

// article
router.route('/articles/:article_id')
	// show article
	.get(models.articles.show)
	// update article
	.put(authUser(['admin']), models.articles.update)
	// remove article
	.delete(authUser(['admin']), models.articles.remove);

// comments
router.route('/articles/:article_id/comments')
	// show all comments for article
	.get(models.comments.showArticleComments)
	// add comment
	.post(authUser(['user']), models.comments.create);

router.route('/articles/:article_id/comments/:comment_id')
	// show comment
	.get(models.comments.showComment)
	// update comment
	.put(authUser(['user', 'admin']), models.comments.update);

router.route('/users/:user_id/comments')
	// show all comments for user
	.get(authUser(['user', 'admin']), models.comments.showUserComments);

// static info
router.route('/information')
	// TODO
	.get(function(req, res) {
		res.status(200).json([]);
	});

// login
router.route('/login')
	.post(models.login.login);

// questions
router.route('/questions')
	// list questions
	.get(models.questions.list)

// question
router.route('/questions/:question_id')
	// show question
	.get(models.questions.show)

// users
router.route('/users')
	// create user
	.post(models.users.create)
	// list users
	.get(authUser(['admin']), models.users.list);

// user
router.route('/users/:user_id')
	// show user
	.get(authUser(['user', 'admin']), models.users.show)
	// update user info
	.put(authUser(['user', 'admin']), models.users.updateUser)
	// remove user
	.delete(authUser(['admin']), models.users.remove);


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
