// user account information is stored here.
// passwords are hashed using bcrypt in order to
// securely store them in the database

var bcrypt = require('bcryptjs');

module.exports = function (app) {
	var knex = app.get('knex');

	return {

		create : function (req, res, next) {
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(req.body.password, salt);
			var type = req.body.type === 'doctor' ? 'doctor' : 'user';

			knex('users')
				.insert({
					user_name: req.body.user_name,
					email_address: req.body.email_address,
					password: hash,
					created_at: knex.raw('NOW()'),
					type: type,
					verified: type === 'user' ? 'Y' : 'N',
					active: 'Y'
				})
				.then(function(id) {
					res.status(200).json({
						success: true,
						data: id
					});
				})
				.catch(function(error) {
					next(error);
				});
		},

		list : function (req, res, next) {
			knex.select('*')
				.from('users')
				.limit(req.body.limit || 10)
				.then(function(rows) {
					res.status(200).json({
						success: true,
						data: rows
					});
				})
				.catch(function(error) {
					next(error);
				});
		},

		show : function (req, res, next) {
			knex.select('*')
				.from('users')
				.where({ id: req.params.user_id })
				.then(function(rows) {
					res.status(200).json({
						success: true,
						data: rows
					});
				})
				.catch(function(error) {
					next(error);
				});
		},

		updateUser : function (req, res, next) {
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(req.body.password, salt);

			knex('users')
				.where({ id: req.params.user_id })
				.update({
					user_name: req.body.user_name,
					email_address: req.body.email_address,
					password: hash,
					updated_at: knex.raw('NOW()')
				})
				.then(function(rows) {
					res.status(200).json({
						success: true,
						data: rows
					});
				})
				.catch(function(error) {
					next(error);
				});
		},

		remove : function (req, res, next) {
			knex('users')
				.where({ id: req.params.user_id })
				.update({ active: 'N'	})
				.then(function(rows) {
					res.status(200).json({
						success: true,
						data: rows
					});
				})
				.catch(function(error) {
					next(error);
				});
		}
	};
};
