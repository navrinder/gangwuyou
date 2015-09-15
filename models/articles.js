// articles uploaded by admin or doctors
var form = require('../lib/form');

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var ArticleModel = require('../lib/models')(app).ArticleModel;
	var ArticleCollection = require('../lib/collections')(app).ArticleCollection;

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
							.catch(cleanup);
						})
						.catch(cleanup);
					}
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
					withRelated: ['comments', 'author'],
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
			.parseQuery(req)
			.fetch({
				withRelated: ['author']
			})
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
			var query = {
				where : { user_id: req.params.user_id	}
			};

			new ArticleCollection()
			.parseQuery(req, query)
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
			var inForm = form.buildForm();

			inForm.parse(req, function (err, fields, files) {
				if (err) {
					return next(err);
				}

				var picture = files.picture;
				form.checkPicture(picture, function (error) {
					if (error) {
						return next(error);
					} else {
						var cleanup = form.cleanup(picture, next);
						var Article = new ArticleModel({
							id: req.params.article_id
						});

						Article.authenticate(req, res)
						.then(function(authed) {

							Article.save({
								user_id: fields.user_id,
								title: fields.title,
								body: fields.body,
								category: fields.category,
								picture: picturePath
							}, {
								patch: true
							})
							.then(function(article) {
								res.status(200).json({
									success: true,
									data: article
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
