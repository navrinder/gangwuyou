// comments for articles

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var CommentModel = require('../lib/models')(app).CommentModel;
	var CommentCollection = require('../lib/collections')(app).CommentCollection;

	return {

		create : function (req, res, next) {
			new CommentModel({
				article_id: req.params.article_id,
				user_id	: req.body.user_id,
				title: req.body.title,
				body: req.body.body,
				active: 'Y'
			})
			.save()
			.then(function(comment) {
				res.status(200).json({
					success: true,
					data: comment
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		showComment : function (req, res, next) {
			new CommentModel({
				id: req.params.comment_id
			})
			.fetch({
				require: true
			})
			.then(function(comment) {
				res.status(200).json({
					success: true,
					data: comment
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		showUserComments : function (req, res, next) {
			var query = {
				where : { user_id: req.params.user_id	}
			};

			new CommentCollection()
			.parseQuery(req, query)
			.fetch({
				require: true
			})
			.then(function(comments) {
				res.status(200).json({
					success: true,
					data: comments
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		showArticleComments : function (req, res, next) {
			var query = {
				where : { user_id: req.params.article_id }
			};

			new CommentCollection()
			.parseQuery(req, query)
			.fetch({
				require: true
			})
			.then(function(comments) {
				res.status(200).json({
					success: true,
					data: comments
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		update : function (req, res, next) {
			var Comment = new CommentModel({
				id: req.params.comment_id
			});

			Comment.authenticate(req, res)
			.then(function(authed) {

				Comment.save({
					article_id: req.params.article_id,
					user_id: req.body.user_id,
					title: req.body.title,
					body: req.body.body,
				}, {
					patch: true
				})
				.then(function(comment) {
					res.status(200).json({
						success: true,
						data: comment
					});
				})
				.catch(function(error) {
					next(error);
				});

			})
			.catch(function(error) {
				// authentication errors are caught here
				next(error);
			});

		},

		remove : function (req, res, next) {
			var Comment = new CommentModel({
				id: req.params.comment_id
			});

			Comment.authenticate(req, res)
			.then(function(authed) {

				Comment.save({
					active: 'N'
				}, {
					patch: true
				})
				.then(function(comment) {
					res.status(200).json({
						success: true,
						data: comment
					});
				})
				.catch(function(error) {
					next(error);
				});

			})
			.catch(function(error) {
				// authentication errors are caught here
				next(error);
			});
		}
	};
};
