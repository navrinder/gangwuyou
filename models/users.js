// user account information is stored here.
// passwords are hashed using bcrypt in order to
// securely store them in the database
var Promise = require('bluebird');
//var bcrypt = Promise.promisfyAll(require('bcryptjs'));
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');


module.exports = function (app) {
	var Bookshelf = app.get('Bookshelf');
	var secret = app.get('config').secret;


	// model
	var User = Bookshelf.Model.extend({
		tableName: 'users',
		hasTimestamps: true
	});

	// collection
	var Users = Bookshelf.Collection.extend({
		model: User
	});

	return {

		create : function (req, res, next) {
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(req.body.password, salt);
			var type = req.body.type === 'doctor' ? 'doctor' : 'user';

			new User({
				user_name: req.body.user_name,
				email_address: req.body.email_address,
				password: hash,
				type: type,
				verified: type === 'user' ? 'Y' : 'N',
				active: 'Y'
			})
			.save()
			.then(function(user) {
				res.status(200).json({
					success: true,
					data: user
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		list : function (req, res, next) {
			new Users()
			.fetch()
			.then(function(users) {
				res.status(200).json({
					success: true,
					data: users
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		show : function (req, res, next) {
			new User({
				id: req.params.user_id
			})
			.fetch({
				require: true
			})
			.then(function(user) {
				res.status(200).json({
					success: true,
					data: user
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		updateUser : function (req, res, next) {
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(req.body.password, salt);

			new User({
				id: req.params.user_id
			})
			.save({
				user_name: req.body.user_name,
				email_address: req.body.email_address,
				password: hash
			}, {
				patch: true
			})
			.then(function(user) {
				res.status(200).json({
					success: true,
					data: user
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		remove : function (req, res, next) {
			new User({
				id: req.params.article_id
			})
			.save({
				active: 'N'
			}, {
				patch: true
			})
			.then(function(user) {
				res.status(200).json({
					success: true,
					data: user
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		login : function (req, res, next) {
			new User({
				email_address: req.body.email_address
			})
			.fetch({
				require: true
			})
			.then(function(user) {
				if (bcrypt.compareSync(req.body.password, rows[0].password)) {
					var payload = {
						iat: Date.now(),
						scopes: [rows[0].type],
						verified: rows[0].verified === 'Y' ? true : false
					};

					var token = jwt.encode(payload, secret);
					res.status(200).json({
						success: true,
						token: token
					});
				} else {
					next({
						status: 401,
						message: 'Unauthorized.'
					});
				}
			})
			.catch(function(error) {
				next(error);
			});
		}
	};
};
