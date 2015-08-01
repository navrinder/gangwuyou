// questions are static but can be stored in the database

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var Question = require('../lib/models')(app).Question;
	var Questions = require('../lib/collections')(app).Questions;

	return {

		list : function (req, res, next) {
			new Questions()
			.fetch()
			.then(function(questions) {
				res.status(200).json({
					success: true,
					data: questions
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		show : function (req, res, next) {
			new Question({
				id: req.params.question_id
			})
			.fetch({
				require: true
			})
			.then(function(question) {
				res.status(200).json({
					success: true,
					data: question
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		create : function (req, res, next) {
			new Question({
				question: req.body.question,
				answers: req.body.answers
			})
			.save()
			.then(function(question) {
				res.status(200).json({
					success: true,
					data: question
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		update : function (req, res, next) {
			new Question({
				id: req.params.question_id
			})
			.save({
				question: req.body.question,
				answers: req.body.answers
			}, {
				patch: true
			})
			.then(function(question) {
				res.status(200).json({
					success: true,
					data: question
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		remove : function (req, res, next) {
			new Question({
				id: req.params.question_id
			})
			.fetch({
				required: true
			})
			.then(function(question) {
				question.destroy()
				.then(function() {
					res.status(200).json({
						success: true,
						data: question
					});
				})
				.catch(function(error) {
					return next(error);
				});
			})
			.catch(function(error) {
				next(error);
			});
		}
	};
};
