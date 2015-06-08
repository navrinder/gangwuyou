module.exports = function(app) {
	var knex = app.get('knex');
	return {

		create : function (req, res, next) {
			knex('users').insert({
				user_name: req.body.username,
				email_address: req.body.email_address,
				password: req.body.password,
				created_at: knex.raw('NOW()')
			}).then(function(id) {
				res.status(200).send('Inserted id ' + id);
			}).catch(function(error) {
				next(error);
			});

		},

		list : function (req, res, next) {
			knex.select('*').from('users')
				.then(function(rows) {
					res.status(200).json(rows);
				}).catch(function(error) {
					next(error);
				});
		},

		profile : function (req, res, next) {
			knex.select('*').from('users').where({ id: req.params.id });
		},

		update : function (req, res, next) {

		},

		remove : function (req, res, next) {

		}
	};
};
