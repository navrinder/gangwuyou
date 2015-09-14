// topic posts created by users
var form = require('../lib/form');

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var TopicModel = require('../lib/models')(app).TopicModel;
	var TopicCollection = require('../lib/collections')(app).TopicCollection;

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
			var query = {};
			if (req.query.limit) {
				query.limit = +req.query.limit;
				delete req.query.limit;
			}
			if (req.query.offset) {
				query.offset = +req.query.offset;
				delete req.query.offset;
			}
			query.where = req.query || {};

			new TopicCollection()
			.query(query)
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
			var query = {};
			if (req.query.limit) {
				query.limit = +req.query.limit;
				delete req.query.limit;
			}
			if (req.query.offset) {
				query.offset = +req.query.offset;
				delete req.query.offset;
			}
			query.where = {	user_id: req.params.user_id	};

			new TopicCollection()
			.query(query)
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

						Topic.authenticate(req, res)
						.then(function(authed) {

							Topic.save({
								user_id: fields.user_id,
								title: fields.title,
								body: fields.body,
								category: fields.category,
								picture: picturePath
							}, {
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
