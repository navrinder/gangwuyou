// login function
// uses bcrypt to verify the password
// and jwt-simple to issue a JSON web token

var bcrypt = require('bcryptjs');
var jwt = require('jwt-simple');

module.exports = function (app) {
	var knex = app.get('knex');
	var secret = app.get('config').secret;

	return {

		login : function (req, res, next) {
			knex.select('*')
				.from('users')
				.where({ email_address: req.body.email_address })
				.then(function(rows) {
					if (bcrypt.compareSync(req.body.password, rows[0].password)) {
						var payload = {
							iat: Date.now(),
							scopes: [rows[0].type],
							verified: rows[0].verified === 'Y' ? true : false
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
			// TODO: nullify token
		}
	};
};
