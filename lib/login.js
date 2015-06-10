var bcrypt = require('bcryptjs');

module.exports = function(app) {
	var knex = app.get('knex');

	return {

		login : function (req, res, next) {
			knex.select('password')
				.from('users')
				.where({ email_address: req.body.email_address })
				.then(function(rows) {
					if (bcrypt.compareSync(req.body.password, rows[0].password)) {
						res.status(200).send('Authenticated');
					} else {
						res.status(401).send('Nope');
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
