// articles uploaded by admin or doctors
var form = require('../lib/form');

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var ArticleModel = require('../lib/models')(app).ArticleModel;
	var ArticleCollection = require('../lib/collections')(app).ArticleCollection;

	return {

		create : function (req, res, next) {
			var inForm = form();

			inForm.parse(req, function (err, fields, files) {
				if (err) {
					return next(err);
				}

				var picturePath = files.picture && files.picture.path.split('public')[1];
				var Article = new ArticleModel({
					user_id: fields.user_id,
					title: fields.title,
					body: fields.body,
					category: fields.category,
					active: 'Y',
					picture: picturePath
				});

				Article.authenticate(req, res)
				.then(function(authed) {

					Article.save()
					.then(function(article) {
						res.status(200).json({
							success: true,
							data: article
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
			});

		},

		show : function (req, res, next) {
			var Article = new ArticleModel({
				id: req.params.article_id
			});

			Article.authenticate(req, res)
			.then(function(authed) {

				Article.fetch({
					withRelated: ['comments'],
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

			})
			.catch(function(error) {
				// authentication errors are caught here
				next(error);
			});
		},

		list : function (req, res, next) {
			new ArticleCollection()
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

		showUserArticles : function (req, res, next) {
			new ArticleCollection()
			.query({ where: { user_id: req.params.user_id	} })
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
			var Article = new ArticleModel({
				id: req.params.article_id
			});

			Article.authenticate(req, res)
			.then(function(authed) {

				Article.save({
					user_id: req.body.user_id,
					title: req.body.title,
					body: req.body.body,
					category: req.body.category,
					picture: req.body.picture
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

			})
			.catch(function(error) {
				// authentication errors are caught here
				next(error);
			});


		},

		remove : function (req, res, next) {
			var Article = new ArticleModel({
				id: req.params.article_id
			});

			Article.authenticate(req, res)
			.then(function(authed) {

				Article.save({
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

			})
			.catch(function(error) {
				// authentication errors are caught here
				next(error);
			});
		}
	};
};
