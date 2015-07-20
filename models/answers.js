// these are used to store user's answers in the database

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');

	// model
	var Answer = Bookshelf.Model.extend({
		tableName: 'answers',
		hasTimestamps: true
	});


	return {

		show : function (req, res, next) {
			new Answer({
				user_id: req.params.user_id
			})
			.fetch({
				require: true
			})
			.then(function(answers) {
				res.status(200).json({
					success: true,
					data: answers
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		updateAnswers : function (req, res, next) {
			new Answer(req.body)
			.save({
				patch: true
			})
			.then(function(answers) {
				res.status(200).json({
					success: true,
					data: answers
				});
			})
			.catch(function(error) {
				next(error);
			});
		}
	};
};
