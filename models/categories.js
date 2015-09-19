// categories for articles

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var CategoryModel = require('../lib/models')(app).CategoryModel;
	var CategoryCollection = require('../lib/collections')(app).CategoryCollection;

	return {

		create : function (req, res, next) {
			var Category = new CategoryModel({
				name: req.body.name
			});

			Category.authenticate(req, res)
			.then(function(authed) {

				Category.save()
				.then(function(category) {
					res.status(200).json({
						success: true,
						data: category
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

		show : function (req, res, next) {
			var Category = new CategoryModel({
				id: req.params.category_id
			});

			Category.fetch({
				require: true
			})
			.then(function(category) {
				res.status(200).json({
					success: true,
					data: category
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		list : function (req, res, next) {
			new CategoryCollection()
			.parseQuery(req)
			.fetch()
			.then(function(categories) {
				res.status(200).json({
					success: true,
					data: categories
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		update : function (req, res, next) {
			var Category = new CategoryModel({
				id: req.params.category_id
			});

			Category.authenticate(req, res)
			.then(function(authed) {

				Category.save({
					name: req.body.name
				}, {
					patch: true
				})
				.then(function(category) {
					res.status(200).json({
						success: true,
						data: category
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
			new CategoryModel({
				id: req.params.category_id
			})
			.fetch({
				required: true
			})
			.then(function(category) {
				category.destroy()
				.then(function() {
					res.status(200).json({
						success: true,
						data: category
					});
				})
				.catch(function(error) {
					return next(error);
				});
			})
			.catch(function(error) {
				next(error);
			});
		}
	};
};
