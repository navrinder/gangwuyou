var express = require('express');

module.exports = function (app) {
	// auth middleware is used to verify the caller's permission
	// in addition to the API token. Include the scope string
	// as the argument to check.
	var authUser = require('./authUser')(app);
	var models = require('../models')(app);
	var router = express.Router();

	return {
		v1: v1(router, models, authUser)
	};
};


function v1 (router, models, authUser) {

	// admin
	router.route('/verify/:user_id')
		// verify account
		.post(authUser('admin'), models.admin.verifyAccount);


	// answer
	router.route('/users/:user_id/answers')
		// show answers
		.get(authUser(['user', 'admin']), models.answers.show)
		// add answer to user
		.post(authUser(['user', 'admin']), models.answers.updateAnswers);

	// articles
	router.route('/articles')
		// list articles
		.get(models.articles.list)
		// create article
		.post(authUser(['admin']), models.articles.create);

	// article
	router.route('/articles/:article_id')
		// show article
		.get(models.articles.show)
		// update article
		.put(authUser(['admin']), models.articles.update)
		// remove article
		.delete(authUser(['admin']), models.articles.remove);

	// comments
	router.route('/articles/:article_id/comments')
		// show all comments for article
		.get(models.comments.showArticleComments)
		// add comment
		.post(authUser(['user']), models.comments.create);

	router.route('/articles/:article_id/comments/:comment_id')
		// show comment
		.get(models.comments.showComment)
		// update comment
		.put(authUser(['user', 'admin']), models.comments.update);

	router.route('/users/:user_id/comments')
		// show all comments for user
		.get(authUser(['user', 'admin']), models.comments.showUserComments);

	// static info
	router.route('/information')
		// TODO
		.get(function(req, res) {
			res.status(200).json([]);
		});

	// login
	router.route('/login')
		.post(models.users.login);

	// questions
	router.route('/questions')
		// list questions
		.get(models.questions.list)

	// question
	router.route('/questions/:question_id')
		// show question
		.get(models.questions.show)

	// users
	router.route('/users')
		// create user
		.post(models.users.create)
		// list users
		.get(authUser(['admin']), models.users.list);

	// user
	router.route('/users/:user_id')
		// show user
		.get(authUser(['user', 'admin']), models.users.show)
		// update user info
		.put(authUser(['user', 'admin']), models.users.updateUser)
		// remove user
		.delete(authUser(['admin']), models.users.remove);

	return router;
}
