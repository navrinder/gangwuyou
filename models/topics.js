// topic posts created by users

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');

	// model
	var Topic = Bookshelf.Model.extend({
		tableName: 'topics',
		hasTimestamps: true
	});

	// collection
	var Topics = Bookshelf.Collection.extend({
		model: Topic
	});

	// TODO relations


	return {

		create : function (req, res, next) {
			new Topic({
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
			new Topic({
				id: req.params.topic_id
			})
			.fetch({
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
			new Topics()
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
			new Topics({
				user_id: req.params.user_id
			})
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
			new Topic({
				id: req.params.topic_id
			})
			.save({
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
		},

		remove : function (req, res, next) {
			new Topic({
				id: req.params.topic_id
			})
			.save({
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
		}
	};
};
