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
	var UserModel = require('../lib/models')(app).UserModel;
	var UserCollection = require('../lib/collections')(app).UserCollection;

	return {

		create : function (req, res, next) {
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(req.body.password, salt);
			var type = req.body.type === 'doctor' ? 'doctor' : 'user';

			new UserModel({
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
			new UserCollection()
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
			var User = new UserModel({
				id: req.params.user_id
			});

			User.authenticate(req, res)
			.then(function(authed) {

				User.fetch({
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

			})
			.catch(function(error) {
				next(error);
			});
		},

		updateUser : function (req, res, next) {
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(req.body.password, salt);

			var User = new UserModel({
				id: req.params.user_id
			});

			User.authenticate(req, res)
			.then(function(authed) {

				User.save({
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

			})
			.catch(function(error) {
				next(error);
			});
		},

		remove : function (req, res, next) {
			new UserModel({
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
			new UserModel({
				email_address: req.body.email_address
			})
			.fetch({
				require: true
			})
			.then(function(user) {
				if (bcrypt.compareSync(req.body.password, user.attributes.password)) {
					var payload = {
						iat: Date.now(),
						id: user.attributes.id,
						scopes: [user.attributes.type],
						verified: user.attributes.verified === 'Y' ? true : false
					};

					var token = jwt.encode(payload, secret);
					res.status(200).json({
						success: true,
						token: token,
						data: user
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
