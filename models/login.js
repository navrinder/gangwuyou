var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');
var secret = require('../config.json').secret;

module.exports = function(app) {
	var knex = app.get('knex');

	return {

		login : function (req, res, next) {
			knex.select('password')
				.from('users')
				.where({ email_address: req.body.email_address })
				.then(function(rows) {
					if (bcrypt.compareSync(req.body.password, rows[0].password)) {
						var payload = {
							iat: Date.now(),
							scopes: ['user']
						};
						var token = jwt.encode(payload, secret);
						res.status(200).json({
							token: token
						});
					} else {
						res.status(401).send('Unauthorized');
					}
				})
				.catch(function(error) {
					next(error);
				});
		},

		logout : function (req, res, next) {

		}
	};
};
