var express = require('express');
var bodyParser = require('body-parser').urlencoded({ extended: true });

module.exports = function (app) {
	var authUser = require('./authUser')(app);
	var models = require('../models')(app);

	return {
		v1: v1(models, authUser),
		views: views()
	};
};


function views () {
	var router = express.Router();

	router.route('/')
		.get(function (req, res, next) {
			res.render('index', {
				title: 'Golden Leaf Index',
				layout: 'layout'
			});
		});

	router.route('/login')
		.get(function (req, res, next) {
			res.render('login', {
				title: 'Golden Leaf Login',
				layout: 'layout'
			});
		});

	router.route('/articles')
		.get(function (req, res, next) {
			res.render('articles', {
				title: 'Golden Leaf Articles',
				layout: 'layout'
			});
		});

	router.route('/clinics')
		.get(function (req, res, next) {
			res.render('clinics', {
				title: 'Golden Leaf Clinics',
				layout: 'layout'
			});
		});

	router.route('/doctors')
		.get(function (req, res, next) {
			res.render('doctors', {
				title: 'Golden Leaf Doctors',
				layout: 'layout'
			});
		});

	router.route('/categories')
		.get(function (req, res, next) {
			res.render('categories', {
				title: 'Golden Leaf Categories',
				layout: 'layout'
			});
		});

	router.route('/download')
		.get(function (req, res, next) {
			res.render('download', {
				title: 'download'
			});
		});



	return router;
}


function v1 (models, authUser) {
	var router = express.Router();

	// announcements
	router.route('/announcements')
		// list announcements
		.get(models.announcements.list)
		// create announcement
		.post(bodyParser, authUser(['doctor', 'admin']), models.announcements.create);

	router.route('/announcements/:announcement_id')
		// show announcement
		.get(models.announcements.show)
		// update announcement
		.put(bodyParser, authUser(['currentUser', 'admin']), models.announcements.update)
		// remove announcement
		.delete(authUser(['currentUser', 'admin']), models.announcements.remove);


	// answers
	router.route('/users/:user_id/answers')
		// show answers
		.get(authUser(['currentUser', 'doctor', 'admin']), models.answers.show)
		// add answer to user
		.post(bodyParser, authUser(['currentUser', 'admin']), models.answers.updateAnswers);


	// articles
	router.route('/articles')
		// list articles
		.get(models.articles.list)
		// create article
		.post(authUser(['doctor', 'admin']), models.articles.create);

	router.route('/articles/:article_id')
		// show article
		.get(models.articles.show)
		// update article
		.put(authUser(['currentUser', 'admin']), models.articles.update)
		// remove article
		.delete(authUser(['currentUser', 'admin']), models.articles.remove);

	router.route('/users/:user_id/articles')
		// show all user articles
		.get(authUser(['user', 'doctor', 'admin']), models.articles.showUserArticles);


	// categories
	router.route('/categories')
		// list categories
		.get(models.categories.list)
		// create category
		.post(bodyParser, authUser(['admin']), models.categories.create);

	router.route('/categories/:category_id')
		// show category
		.get(models.categories.show)
		// update category
		.put(bodyParser, authUser(['admin']), models.categories.update)
		// remove category
		.delete(authUser(['admin']), models.categories.remove);


	// clinics
	router.route('/clinics')
		// list clinics
		.get(models.clinics.list)
		// create clinic
		.post(authUser(['admin']), models.clinics.create);

	router.route('/clinics/:clinic_id')
		// show clinic
		.get(models.clinics.show)
		// update clinic
		.put(authUser(['admin']), models.clinics.update)
		// remove clinic
		.delete(authUser(['admin']), models.clinics.remove);


	// comments
	router.route('/articles/:article_id/comments')
		// show all comments for article
		.get(models.comments.showArticleComments)
		// add comment
		.post(bodyParser, authUser(['user', 'doctor', 'admin']), models.comments.create);

	router.route('/articles/:article_id/comments/:comment_id')
		// show comment
		.get(models.comments.showComment)
		// update comment
		.put(bodyParser, authUser(['currentUser', 'admin']), models.comments.update)
		// remove comment
		.delete(authUser(['currentUser', 'admin']), models.comments.remove);


	router.route('/users/:user_id/comments')
		// show all comments for user
		.get(authUser(['user', 'doctor', 'admin']), models.comments.showUserComments);

	// router.route('/users/:user_id/comments/:comment_id')
	// 	// update comment
	// 	.put(authUser(['currentUser', 'admin']), models.comments.update)
	// 	// remove comment
	// 	.delete(authUser(['currentUser', 'admin']), models.comments.remove);


	// doctors -- only relates to hospitals, not users
	router.route('/clinics/:clinic_id/doctors')
		// show all doctors for clinic
		.get(models.doctors.list)
		// add doctor
		.post(authUser(['admin']), models.doctors.create);

	router.route('/clinics/:clinic_id/doctors/:doctor_id')
		// show doctor
		.get(models.doctors.show)
		// update doctor
		.put(authUser(['admin']), models.doctors.update)
		// remove doctor
		.delete(authUser(['admin']), models.doctors.remove);


	// app version info
	router.route('/latest')
		.get(authUser(['admin']), models.info.list);

	router.route('/latest/:os')
		.get(models.info.showLatest)
		.post(bodyParser, authUser(['admin']), models.info.create);


	// login
	router.route('/login')
		.post(bodyParser, models.users.login);


	// questions
	router.route('/questions')
		// list questions
		.get(authUser(['user', 'doctor', 'admin']), models.questions.list)
		// create question
		.post(bodyParser, authUser(['admin']), models.questions.create);

	router.route('/questions/:question_id')
		// show question
		.get(authUser(['user', 'doctor', 'admin']), models.questions.show)
		// update question
		.put(bodyParser, authUser(['admin']), models.questions.update)
		// remove question
		.delete(authUser(['admin']), models.questions.remove);


	// reminders
	router.route('/users/:user_id/reminders')
		// list reminders
		.get(authUser(['currentUser', 'admin']), models.reminders.list)
		// create reminder
		.post(bodyParser, authUser(['currentUser', 'admin']), models.reminders.create);

	router.route('/users/:user_id/reminders/:reminder_id')
		// show reminder
		.get(authUser(['currentUser', 'admin']), models.reminders.show)
		// update reminder
		.put(bodyParser, authUser(['currentUser', 'admin']), models.reminders.update)
		// remove reminder
		.delete(authUser(['currentUser', 'admin']), models.reminders.remove);


	// replies
	router.route('/topics/:topic_id/replies')
		// show all replies for article
		.get(models.replies.showTopicReplies)
		// add reply
		.post(bodyParser, authUser(['user', 'doctor', 'admin']), models.replies.create);

	router.route('/topics/:topic_id/replies/:reply_id')
		// show reply
		.get(models.replies.showReply)
		// update reply
		.put(bodyParser, authUser(['currentUser', 'admin']), models.replies.update)
		// remove reply
		.delete(authUser(['currentUser', 'admin']), models.replies.remove);

	router.route('/users/:user_id/replies')
		// show all replies for user
		.get(authUser(['currentUser', 'admin']), models.replies.showUserReplies);

	// router.route('/users/:user_id/replies/:reply_id')
	// 	// update reply
	// 	.put(authUser(['currentUser', 'admin']), models.replies.update)
	// 	// remove reply
	// 	.delete(authUser(['currentUser', 'admin']), models.replies.remove);


	// topics
	router.route('/topics')
		// list topics
		.get(models.topics.list)
		// create topic
		.post(authUser(['user', 'doctor', 'admin']), models.topics.create);

	router.route('/topics/:topic_id')
		// show topic
		.get(models.topics.show)
		// update topic
		.put(authUser(['currentUser', 'admin']), models.topics.update)
		// remove topic
		.delete(authUser(['currentUser', 'admin']), models.topics.remove);

	router.route('/users/:user_id/topics')
		// show all topics for user
		.get(authUser(['user', 'doctor', 'admin']), models.topics.showUserTopics);


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

	// users limited
	router.route('/users-public')
		.get(models.users.listPublic);

	router.route('/users-public/:user_id')
		.get(models.users.showPublic);

	return router;
}
