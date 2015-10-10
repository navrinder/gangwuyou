// topic posts created by users
var form = require('../lib/form');
var _ = require('lodash');

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var TopicModel = require('../lib/models')(app).TopicModel;
	var TopicCollection = require('../lib/collections')(app).TopicCollection;
	var ReplyModel = require('../lib/models')(app).ReplyModel;
	var ReplyCollection = require('../lib/collections')(app).ReplyCollection;


	return {

		create : function (req, res, next) {
			var inForm = form.buildForm();

			inForm.parse(req, function (err, fields, files) {
				if (err) {
					return next(err);
				}

				var picture = files.picture;

				form.checkPicture(picture, function (error, picturePath) {
					if (error) {
						return next(error);
					} else {
						var cleanup = form.cleanup(picture, next);
						var Topic = new TopicModel({
							user_id: fields.user_id,
							title: fields.title,
							body: fields.body,
							category: fields.category,
							picture: picturePath,
							active: 'Y'
						});

						Topic.authenticate(req, res)
						.then(function(authed) {

							Topic.save()
							.then(function(topic) {
								res.status(200).json({
									success: true,
									data: topic
								});
							})
							.catch(cleanup);
						})
						.catch(cleanup);
					}
				});
			});
		},

		show : function (req, res, next) {
			new TopicModel({
				id: req.params.topic_id
			})
			.fetch({
				withRelated: [{'user': function(qb) {
					qb.column(
						'id',
						'user_name',
						'type',
						'name',
						'sex',
						'birth_day',
						'birth_month',
						'birth_year',
						'picture',
						'occupation',
						'hospital',
						'department',
						'city',
						'author'
					);
				}}],
				require: true
			})
			.then(function(topic) {
				topic.replyCount(function (error, count) {
					if (error) {
						return next(error);
					}
					topic.set('replyCount', count);
					topic.lastReply(function (error, last) {
						if (error) {
							return next(error);
						}
						topic.set('lastReply', last);
						res.status(200).json({
							success: true,
							data: topic
						});
					});
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		list : function (req, res, next) {
			new TopicCollection()
			.parseQuery(req)
			.fetch({
				withRelated: [{'user': function(qb) {
					qb.column(
						'id',
						'user_name',
						'type',
						'name',
						'sex',
						'birth_day',
						'birth_month',
						'birth_year',
						'picture',
						'occupation',
						'hospital',
						'department',
						'city',
						'author'
					);
				}}]
			})
			.then(function(topics) {
				var length = topics.models.length;
				_.forEach(topics.models, function (topic, i) {
					topic.replyCount(function (error, count) {
						if (error) {
							next(error);
							return false;
						}
						topics.models[i].set('replyCount', count);
						topic.lastReply(function (error, last) {
							if (error) {
								next(error);
								return false;
							}
							topics.models[i].set('lastReply', last);
							if (--length === 0) {
								res.status(200).json({
									success: true,
									data: topics
								});
							}
						});
					});
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		showUserTopics : function (req, res, next) {
			var query = {
				where : {	user_id: req.params.user_id	}
			};

			new TopicCollection()
			.parseQuery(req, query)
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
			var inForm = form.buildForm();

			inForm.parse(req, function (err, fields, files) {
				if (err) {
					return next(err);
				}

				var picture = files.picture;

				form.checkPicture(picture, function (error, picturePath) {
					if (error) {
						return next(error);
					} else {
						var cleanup = form.cleanup(picture, next);
						var Topic = new TopicModel({
							id: req.params.topic_id
						});

						var updatedInfo = _({
							user_id: fields.user_id,
							title: fields.title,
							body: fields.body,
							category: fields.category,
							picture: picturePath
						}).omit(_.isUndefined).value();

						Topic.authenticate(req, res)
						.then(function(authed) {

							Topic.save(updatedInfo, {
								patch: true
							})
							.then(function(topic) {
								res.status(200).json({
									success: true,
									data: topic
								});
							})
							.catch(cleanup);
						})
						.catch(cleanup);
					}
				});
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
