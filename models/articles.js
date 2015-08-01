// articles uploaded by admin or doctors

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var Article = require('../lib/models')(app).Article;
	var Article = require('../lib/collections')(app).Articles;

	return {

		create : function (req, res, next) {
			new Article({
				user_id: req.body.user_id,
				title: req.body.title,
				body: req.body.body,
				category: req.body.category,
				active: 'Y'
			})
			.save()
			.then(function(article) {
				res.status(200).json({
					success: true,
					data: article
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		show : function (req, res, next) {
			new Article({
				id: req.params.article_id
			})
			.fetch({
				require: true
			})
			.then(function(article) {
				res.status(200).json({
					success: true,
					data: article
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		list : function (req, res, next) {
			new Articles()
			.fetch()
			.then(function(articles) {
				res.status(200).json({
					success: true,
					data: articles
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		update : function (req, res, next) {
			new Article({
				id: req.params.article_id
			})
			.save({
				user_id: req.body.user_id,
				title: req.body.title,
				body: req.body.body,
				category: req.body.category
			}, {
				patch: true
			})
			.then(function(article) {
				res.status(200).json({
					success: true,
					data: article
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		remove : function (req, res, next) {
			new Article({
				id: req.params.article_id
			})
			.save({
				active: 'N'
			}, {
				patch: true
			})
			.then(function(article) {
				res.status(200).json({
					success: true,
					data: article
				});
			})
			.catch(function(error) {
				next(error);
			});
		}
	};
};
