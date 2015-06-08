var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config.json');
var knex = require('knex')({
	client: 'mysql',
	connection: {
		host : config.database.host,
		port : config.database.port,
		user : config.database.user,
		password : config.database.password,
		database : config.database.database
	}
});

var admin = require('./lib/admin');
var articles = require('./lib/articles');
var feed = require('./lib/feed');
var info = require('./lib/information');
var login = require('./lib/login');
var questions = require('./lib/questions');

var app = express();
var router = express.Router();
var port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('knex', knex);

var users = require('./lib/users')(app);


// routes
router.use(function(req, res, next) {
	console.log('alert');
	next();
});

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
// router.route('/users/:user_id')
// 	// show user
// 	.get(users.show)
// 	// update user
// 	.put(users.update)
// 	// remove user
// 	.delete(users.remove);


// register routes
app.use('/api', router);


app.listen(port);
console.log('Golden Leaf started on port ' + port);
