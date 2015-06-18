var bcrypt = require('bcryptjs');

module.exports = function(app) {
	var knex = app.get('knex');

	return {

		create : function (req, res, next) {
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(req.body.password, salt);
			knex('users')
				.insert({
					user_name: req.body.username,
					email_address: req.body.email_address,
					password: hash,
					created_at: knex.raw('NOW()'),
					type: req.body.type,
					verified: 'N'
				})
				.then(function(id) {
					res.status(200).send('Inserted id ' + id);
				})
				.catch(function(error) {
					next(error);
				});
		},

		list : function (req, res, next) {
			knex.select('*')
				.from('users')
				.then(function(rows) {
					res.status(200).json(rows);
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
					res.status(200).json(rows);
				})
				.catch(function(error) {
					next(error);
				});
		},

		update : function (req, res, next) {
			var salt = bcrypt.genSaltSync(10);
			var hash = bcrypt.hashSync(req.body.password, salt);

			knex('users')
				.where({ id: req.params.user_id })
				.update({
					user_name: req.body.username,
					email_address: req.body.email_address,
					password: hash,
					updated_at: knex.raw('NOW()')
				})
				.then(function(rows) {
					res.status(200).send('Success ' + rows);
				})
				.catch(function(error) {
					next(error);
				});
		},

		remove : function (req, res, next) {
			knex('users')
				.where({ id: req.params.user_id })
				.del()
				.then(function(rows) {
					res.status(200).send('Success ' + rows);
				})
				.catch(function(error) {
					next(error);
				});
		}
	};
};
