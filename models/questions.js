// questions are static but can be stored in the database

module.exports = function(app) {
	var knex = app.get('knex');

	return {

		list : function (req, res, next) {
			knex.select('*')
				.from('questions')
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
				.from('questions')
				.where({ id: question_id })
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

		create : function (req, res, next) {
			knex('questions')
				.insert({
					question: req.body.question,
					answers: req.body.answers
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

		update : function (req, res, next) {
			knex('questions')
				.where({ id: req.body.question_id })
				.update({
					question: req.body.question,
					answers: req.body.answers
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
			knex('questions')
				.where({ id: req.params.question_id })
				.del()
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
