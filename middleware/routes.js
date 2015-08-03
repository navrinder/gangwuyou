var express = require('express');

module.exports = function (app) {
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
		.post(authUser(['admin']), models.admin.verifyAccount);


	// announcements
	router.route('/announcements')
		// list announcements
		.get(authUser(['user', 'doctor', 'admin']), models.announcements.list)
		// create announcement
		.post(authUser(['doctor', 'admin']), models.announcements.create);

	router.route('/announcements/:announcement_id')
		// show announcement
		.get(authUser(['user', 'doctor', 'admin']), models.announcements.show)
		// update announcement
		.put(authUser(['currentUser', 'admin']), models.announcements.update)
		// remove announcement
		.delete(authUser(['doctor', 'admin']), models.announcements.remove);


	// answers
	router.route('/users/:user_id/answers')
		// show answers
		.get(authUser(['currentUser', 'doctor', 'admin']), models.answers.show)
		// add answer to user
		.post(authUser(['currentUser', 'admin']), models.answers.updateAnswers);


	// articles
	router.route('/articles')
		// list articles
		.get(authUser(['user', 'doctor', 'admin']), models.articles.list)
		// create article
		.post(authUser(['doctor', 'admin']), models.articles.create);

	router.route('/articles/:article_id')
		// show article
		.get(authUser(['user', 'doctor', 'admin']), models.articles.show)
		// update article
		.put(authUser(['currentUser', 'admin']), models.articles.update)
		// remove article
		.delete(authUser(['currentUser', 'admin']), models.articles.remove);


	// clinics
	router.route('/clinics')
		// list clinics
		.get(authUser(['user', 'doctor', 'admin']), models.clinics.list)
		// create clinic
		.post(authUser(['admin']), models.clinics.create);

	router.route('/clinics/:clinic_id')
		// show clinic
		.get(authUser(['user', 'doctor', 'admin']), models.clinics.show)
		// update clinic
		.put(authUser(['admin']), models.clinics.update)
		// remove clinic
		.delete(authUser(['admin']), models.clinics.remove);


	// comments
	router.route('/articles/:article_id/comments')
		// show all comments for article
		.get(authUser(['user', 'doctor', 'admin']), models.comments.showArticleComments)
		// add comment
		.post(authUser(['user', 'doctor', 'admin']), models.comments.create);

	router.route('/articles/:article_id/comments/:comment_id')
		// show comment
		.get(authUser(['user', 'doctor', 'admin']), models.comments.showComment)
		// update comment
		.put(authUser(['currentUser', 'admin']), models.comments.update);
		// remove comment
		.delete(authUser(['currentUser', 'admin']), models.comments.remove);


	router.route('/users/:user_id/comments')
		// show all comments for user
		.get(authUser(['currentUser', 'admin']), models.comments.showUserComments);

	router.route('/users/:user_id/comments/:comment_id')
		// update comment
		.put(authUser(['currentUser', 'admin']), models.comments.update);
		// remove comment
		.delete(authUser(['currentUser', 'admin']), models.comments.remove);


	// static info
	router.route('/information')
		// TODO
		.get(function(req, res) {
			res.status(500).end();
		});


	// login
	router.route('/login')
		.post(models.users.login);


	// questions
	router.route('/questions')
		// list questions
		.get(authUser(['user', 'doctor', 'admin']), models.questions.list)
		// create question
		.post(authUser(['admin']), models.questions.create);

	router.route('/questions/:question_id')
		// show question
		.get(authUser(['user', 'doctor', 'admin']), models.questions.show)
		// update question
		.put(authUser(['admin']), models.questions.update)
		// remove question
		.delete(authUser(['admin']), models.questions.remove);


	// reminders
	router.route('/users/:user_id/reminders')
		// list reminders
		.get(authUser(['currentUser', 'admin']), models.reminders.list)
		// create reminder
		.post(authUser(['user', 'doctor', 'admin']), models.reminders.create);

	router.route('/users/:user_id/reminders/:reminder_id')
		// show reminder
		.get(authUser(['currentUser', 'admin']), models.reminders.show)
		// update reminder
		.put(authUser(['currentUser', 'admin']), models.reminders.update)
		// remove reminder
		.delete(authUser(['currentUser', 'admin']), models.reminders.remove);


	// replies
	router.route('/topics/:topic_id/replies')
		// show all replies for article
		.get(authUser(['user', 'doctor', 'admin']), models.replies.showTopicReplies)
		// add reply
		.post(authUser(['user', 'doctor', 'admin']), models.replies.create);

	router.route('/topics/:topic_id/replies/:reply_id')
		// show reply
		.get(authUser(['user', 'doctor', 'admin']), models.replies.showReply)
		// update reply
		.put(authUser(['currentUser', 'admin']), models.replies.update);
		// remove reply
		.delete(authUser(['currentUser', 'admin']), models.replies.remove);

	router.route('/users/:user_id/replies')
		// show all replies for user
		.get(authUser(['currentUser', 'admin']), models.replies.showUserReplies);

	router.route('/users/:user_id/replies/:reply_id')
		// update reply
		.put(authUser(['currentUser', 'admin']), models.replies.update);
		// remove reply
		.delete(authUser(['currentUser', 'admin']), models.replies.remove);


	// topics
	router.route('/topics')
		// list topics
		.get(authUser(['user', 'doctor', 'admin']), models.topics.list)
		// create topic
		.post(authUser(['user', 'doctor', 'admin']), models.topics.create);

	router.route('/topics/:topic_id')
		// show topic
		.get(authUser(['user', 'doctor', 'admin']), models.topics.show)
		// update topic
		.put(authUser(['currentUser', 'admin']), models.topics.update)
		// remove topic
		.delete(authUser(['currentUser', 'admin']), models.topics.remove);

	router.route('/users/:user_id/topics')
		// show all topics for user
		.get(authUser(['currentUser', 'admin']), models.topics.showUserTopics);


	// users
	router.route('/users')
		// create user
		.post(models.users.create)
		// list users
		.get(authUser(['admin']), models.users.list);

	router.route('/users/:user_id')
		// show user
		.get(authUser(['currentUser', 'admin']), models.users.show)
		// update user info
		.put(authUser(['currentUser', 'admin']), models.users.updateUser)
		// remove user
		.delete(authUser(['admin']), models.users.remove);

	return router;
}
