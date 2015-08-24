// topic posts created by users

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var TopicModel = require('../lib/models')(app).TopicModel;
	var TopicCollection = require('../lib/collections')(app).TopicCollection;

	return {

		create : function (req, res, next) {
			new TopicModel({
				user_id: req.body.user_id,
				title: req.body.title,
				body: req.body.body,
				category: req.body.category,
				active: 'Y'
			})
			.save()
			.then(function(topic) {
				res.status(200).json({
					success: true,
					data: topic
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		show : function (req, res, next) {
			new TopicModel({
				id: req.params.topic_id
			})
			.fetch({
				withRelated: ['replies'],
				require: true
			})
			.then(function(topic) {
				res.status(200).json({
					success: true,
					data: topic
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		list : function (req, res, next) {
			new TopicCollection()
			.fetch()
			.then(function(topics) {
				res.status(200).json({
					success: true,
					data: topics
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		showUserTopics : function (req, res, next) {
			new TopicCollection()
			.query({ where: {	user_id: req.params.user_id	} })
			.fetch({
				require: true
			})
			.then(function(topics) {
				res.status(200).json({
					success: true,
					data: topics
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		update : function (req, res, next) {
			var Topic = new TopicModel({
				id: req.params.topic_id
			});

			Topic.authenticate(req, res)
			.then(function(authed) {

				Topic.save({
					user_id: req.body.user_id,
					title: req.body.title,
					body: req.body.body,
					category: req.body.category
				}, {
					patch: true
				})
				.then(function(topic) {
					res.status(200).json({
						success: true,
						data: topic
					});
				})
				.catch(function(error) {
					next(error);
				});

			})
			.catch(function(error) {
				next(error);
			});
		},

		remove : function (req, res, next) {
			var Topic = new TopicModel({
				id: req.params.topic_id
			});


			Topic.authenticate(req, res)
			.then(function(authed) {

				Topic.save({
					active: 'N'
				}, {
					patch: true
				})
				.then(function(topic) {
					res.status(200).json({
						success: true,
						data: topic
					});
				})
				.catch(function(error) {
					next(error);
				});

			})
			.catch(function(error) {
				next(error);
			});
		}
	};
};
