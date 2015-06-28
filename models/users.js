// user account information is stored here.
// passwords are hashed using bcrypt in order to
// securely store them in the database

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
				.limit(req.body.limit || 10)
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
			var payload = req.body;

			if (req.body.password) {
				var salt = bcrypt.genSaltSync(10);
				var hash = bcrypt.hashSync(req.body.password, salt);
				payload.password = hash;
			}

			payload.updated_at = knex.raw('NOW()');

			knex('users')
				.where({ id: req.params.user_id })
				.update(payload)
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
