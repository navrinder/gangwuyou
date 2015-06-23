// these are used to store user's answers in the database

module.exports = function(app) {
	var knex = app.get('knex');

	return {

		list : function (req, res, next) {
			knex.select('*')
				.from('answers')
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
				.from('answers')
				.where({ user_id: user_id })
				.then(function(rows) {
					res.status(200).json(rows);
				})
				.catch(function(error) {
					next(error);
				});
		},

		create : function (req, res, next) {
			knex('answers')
				.insert({
					user_id: req.body.user_id,
					user_answers: req.body.answers
				})
				.then(function(id) {
					res.status(200).send('Inserted id ' + id);
				})
				.catch(function(error) {
					next(error);
				});
		},

		update : function (req, res, next) {
			knex('answers')
				.where({ user_id: req.body.user_id })
				.update({
					user_answers: req.body.user_answers
				})
				.then(function(rows) {
					res.status(200).send('Success ' + rows);
				})
				.catch(function(error) {
					next(error);
				});
		},

		remove : function (req, res, next) {
			knex('answers')
				.where({ user_id: req.params.user_id })
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
