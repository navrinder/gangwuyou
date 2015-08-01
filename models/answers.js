// these are used to store user's answers in the database

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var Answer = require('../lib/models')(app).Answer;

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
				user_id 		: req.params.user_id,
				question_1  : req.body.question_1,
				question_2  : req.body.question_2,
				question_3  : req.body.question_3,
				question_4  : req.body.question_4,
				question_5  : req.body.question_5,
				question_6  : req.body.question_6,
				question_7  : req.body.question_7,
				question_8  : req.body.question_8,
				question_9  : req.body.question_9,
				question_10 : req.body.question_10,
				question_11 : req.body.question_11,
				question_12 : req.body.question_12
			}, {
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
