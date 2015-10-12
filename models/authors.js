// article authors are fake user accounts
// only admin can create and impersonate authors

var Promise = require('bluebird');
//var bcrypt = Promise.promisfyAll(require('bcryptjs'));
var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var form = require('../lib/form');
var _ = require('lodash');

module.exports = function (app) {
	var secret = app.get('config').secret;
	var UserModel = require('../lib/models')(app).UserModel;
	var UserCollection = require('../lib/collections')(app).UserCollection;

	return {

		create : function (req, res, next) {
			var inForm = form.buildForm();
			var now = Date.now();

			inForm.parse(req, function (err, fields, files) {
				if (err) {
					return next(err);
				}

				var salt = bcrypt.genSaltSync(10);
				var hash = bcrypt.hashSync(now.toString(36), salt);
				var type = 'author';
				var picture = files.picture;

				form.checkPicture(picture, function (error, picturePath) {
					if (error) {
						return next(error);
					} else {
						var cleanup = form.cleanup(picture, next);
						new UserModel({
							user_name: 'author_' + now,
							email_address: 'author_' + now,
							password: hash,
							type: type,
							verified: 'Y',
							active: 'Y',
							name: fields.name,
							sex: fields.sex,
							birth_day: fields.birth_day,
							birth_month: fields.birth_month,
							birth_year: fields.birth_year,
							phone_number: now,
							picture: picturePath,
							occupation: fields.occupation,
							hospital: fields.hospital,
							department: fields.department,
							city: fields.city,
							announcement_author: fields.announcement_author || 'N'
						})
						.save()
						.then(function(author) {
							res.status(200).json({
								success: true,
								data: author.omit('password')
							});
						})
						.catch(cleanup);
					}
				});
			});
		},

		list : function (req, res, next) {
			var Authors = new UserCollection().parseQuery(req, {where: {type: 'author'}});

			Authors.fetch({
				columns: Authors.user_columns
			})
			.then(function(authors) {
				res.status(200).json({
					success: true,
					data: authors
				});
			})
			.catch(next);
		},

		show : function (req, res, next) {
			var Author = new UserModel({
				id: req.params.author_id
			});

			Author.fetch({
				columns: Author.user_columns,
				require: true
			})
			.then(function(author) {
				res.status(200).json({
					success: true,
					data: author
				});
			})
			.catch(next);
		},

		update : function (req, res, next) {
			var inForm = form.buildForm();

			inForm.parse(req, function (err, fields, files) {
				if (err) {
					return next(err);
				}

				// var salt = bcrypt.genSaltSync(10);
				// var hash = fields.password && bcrypt.hashSync(fields.password, salt);

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
							//password: hash
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
			.catch(next);
		}
	};
};
