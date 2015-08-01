// replies to user topics

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');

	// model
	var Reply = Bookshelf.Model.extend({
		tableName: 'replies',
		hasTimestamps: true
	});

	// collection
	var Replies = Bookshelf.Collection.extend({
		model: Reply
	});

	return {

		create : function (req, res, next) {
			new Reply({
				topic_id: req.params.topic_id,
				user_id	: req.body.user_id,
				title: req.body.title,
				body: req.body.body,
				active: 'Y'
			})
			.save()
			.then(function(reply) {
				res.status(200).json({
					success: true,
					data: reply
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		showReply : function (req, res, next) {
			new Reply({
				id: req.params.reply_id
			})
			.fetch({
				require: true
			})
			.then(function(reply) {
				res.status(200).json({
					success: true,
					data: reply
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		showUserReplies : function (req, res, next) {
			new Replies({
				user_id: req.params.user_id
			})
			.fetch({
				require: true
			})
			.then(function(replies) {
				res.status(200).json({
					success: true,
					data: replies
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		showTopicReplies : function (req, res, next) {
			new Replies({
				topic_id: req.params.topic_id
			})
			.fetch({
				require: true
			})
			.then(function(replies) {
				res.status(200).json({
					success: true,
					data: replies
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		update : function (req, res, next) {
			new Reply({
				id: req.params.reply_id
			})
			.save({
				topic_id: req.params.topic_id,
				user_id: req.body.user_id,
				title: req.body.title,
				body: req.body.body,
			}, {
				patch: true
			})
			.then(function(reply) {
				res.status(200).json({
					success: true,
					data: reply
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		remove : function (req, res, next) {
			new Reply({
				id: req.params.reply_id
			})
			.save({
				active: 'N'
			}, {
				patch: true
			})
			.then(function(reply) {
				res.status(200).json({
					success: true,
					data: reply
				});
			})
			.catch(function(error) {
				next(error);
			});
		}
	};
};
