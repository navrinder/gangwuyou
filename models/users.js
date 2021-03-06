// user account information is stored here.
// passwords are hashed using bcrypt in order to
// securely store them in the database
var Promise = require('bluebird');
//var bcrypt = Promise.promisfyAll(require('bcryptjs'));
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var form = require('../lib/form');
var _ = require('lodash');

module.exports = function (app) {
	var Bookshelf = app.get('Bookshelf');
	var secret = app.get('config').secret;
	var UserModel = require('../lib/models')(app).UserModel;
	var UserCollection = require('../lib/collections')(app).UserCollection;

	return {

		create : function (req, res, next) {
			var inForm = form.buildForm();

			inForm.parse(req, function (err, fields, files) {
				if (err) {
					return next(err);
				}

				var salt = bcrypt.genSaltSync(10);
				var hash = bcrypt.hashSync(fields.password, salt);
				var type = fields.type === 'doctor' ? 'doctor' : 'user';
				var picture = files.picture;

				form.checkPicture(picture, function (error, picturePath) {
					if (error) {
						return next(error);
					} else {
						var cleanup = form.cleanup(picture, next);
						new UserModel({
							user_name: fields.user_name,
							email_address: fields.email_address,
							password: hash,
							type: type,
							verified: type === 'user' ? 'Y' : 'N',
							active: 'Y',
							name: fields.name,
							sex: fields.sex,
							birth_day: fields.birth_day,
							birth_month: fields.birth_month,
							birth_year: fields.birth_year,
							phone_number: fields.phone_number,
							picture: picturePath,
							occupation: fields.occupation,
							hospital: fields.hospital,
							department: fields.department,
							city: fields.city,
							announcement_author: fields.announcement_author || 'N',
							article_author: fields.article_author || 'N'
						})
						.save()
						.then(function(user) {
							res.status(200).json({
								success: true,
								data: user.omit('password')
							});
						})
						.catch(cleanup);
					}
				});
			});
		},

		list : function (req, res, next) {
			new UserCollection()
			.parseQuery(req)
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

		listPublic : function (req, res, next) {
			new UserCollection()
			.parseQuery(req)
			.fetch({
				columns: [
					'id',
					'user_name',
					'occupation',
					'hospital',
					'picture',
					'announcement_author'
				]
			})
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
						data: user.omit('password')
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

		showPublic : function (req, res, next) {
			var User = new UserModel({
				id: req.params.user_id
			});

			User.fetch({
				columns: [
					'id',
					'user_name',
					'occupation',
					'hospital',
					'picture',
					'announcement_author'
				],
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
			var inForm = form.buildForm();

			inForm.parse(req, function (err, fields, files) {
				if (err) {
					return next(err);
				}

				var salt = bcrypt.genSaltSync(10);
				var hash = fields.password && bcrypt.hashSync(fields.password, salt);

				var picture = files.picture;

				form.checkPicture(picture, function (error, picturePath) {
					if (error) {
						return next(error);
					} else {
						var cleanup = form.cleanup(picture, next);
						var User = new UserModel({
							id: req.params.user_id
						});

						var updatedInfo = _({
							user_name: fields.user_name,
							email_address: fields.email_address,
							name: fields.name,
							sex: fields.sex,
							birth_day: fields.birth_day,
							birth_month: fields.birth_month,
							birth_year: fields.birth_year,
							phone_number: fields.phone_number,
							picture: picturePath,
							occupation: fields.occupation,
							hospital: fields.hospital,
							department: fields.department,
							city: fields.city,
							announcement_author: fields.announcement_author,
							article_author: fields.article_author,
							password: hash
						}).omit(_.isUndefined).value();

						User.authenticate(req, res)
						.then(function(authed) {

							User.save(updatedInfo, {
								patch: true
							})
							.then(function(user) {
								res.status(200).json({
									success: true,
									data: user
								});
							})
							.catch(cleanup);
						})
						.catch(cleanup);
					}
				});
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
			new UserModel(_({
				email_address: req.body.email_address,
				phone_number: req.body.phone_number,
				user_name: req.body.user_name
			}).omit(_.isUndefined).value())
			.fetch({
				require: true
			})
			.then(function(user) {
				if (user.get('type') === 'author') {
					return next({
						status: 401,
						message: 'Unauthorized.'
					});
				}
				if (bcrypt.compareSync(req.body.password, user.get('password'))) {
					var payload = {
						iat: Date.now(),
						id: user.get('id'),
						scopes: [user.get('type')],
						verified: user.get('verified') === 'Y' ? true : false
					};

					var token = jwt.encode(payload, secret);
					res.status(200).json({
						success: true,
						token: token,
						data: user.omit('password')
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
