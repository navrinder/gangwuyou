// questions are static but can be stored in the database
var _ = require('lodash');

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var QuestionModel = require('../lib/models')(app).QuestionModel;
	var QuestionCollection = require('../lib/collections')(app).QuestionCollection;

	return {

		list : function (req, res, next) {
			new QuestionCollection()
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
			new QuestionModel({
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
			new QuestionModel({
				question: req.body.question,
				answer_a: req.body.answer_a,
				answer_b: req.body.answer_b,
				answer_c: req.body.answer_c,
				answer_d: req.body.answer_d
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
			var updatedInfo = _({
				question: req.body.question,
				answer_a: req.body.answer_a,
				answer_b: req.body.answer_b,
				answer_c: req.body.answer_c,
				answer_d: req.body.answer_d
			}).omit(_.isUndefined).value();

			new QuestionModel({
				id: req.params.question_id
			})
			.save(updatedInfo, {
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
			new QuestionModel({
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
