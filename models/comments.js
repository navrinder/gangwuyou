// comments for articles

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');

	// model
	var Comment = Bookshelf.Model.extend({
		tableName: 'comments',
		hasTimestamps: true
	});

	// collection
	var Comments = Bookshelf.Collection.extend({
		model: Comment
	});

	return {

		create : function (req, res, next) {
			new Comment({
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
			new Comment({
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
			new Comments({
				user_id: req.params.user_id
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

		showArticleComments : function (req, res, next) {
			new Comments({
				article: req.params.article_id
			})
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
			new Comment({
				id: req.params.comment_id
			})
			.save({
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
		},

		remove : function (req, res, next) {
			new Comment({
				id: req.params.comment_id
			})
			.save({
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
		}
	};
};
