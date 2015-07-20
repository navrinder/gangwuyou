// static info
//
module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');

	// model
	var Info = Bookshelf.Model.extend({
		tableName: 'information',
		hasTimestamps: true
	});

	var Infos = Bookshelf.Model.extend({
		model: Info
	})


	// TODO relations


	return {

		create : function (req, res, next) {
			new Info({
				id: req.body.id,
				title: req.body.title,
				body: req.body.body
			})
			.save()
			.then(function(info) {
				res.status(200).json({
					success: true,
					data: info
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		show : function (req, res, next) {
			new Info({
				id: req.params.info_id
			})
			.fetch({
				require: true
			})
			.then(function(info) {
				res.status(200).json({
					success: true,
					data: info
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		list : function (req, res, next) {
			new Infos()
			.fetch()
			.then(function(info) {
				res.status(200).json({
					success: true,
					data: info
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		update : function (req, res, next) {
			new Info({
				id: req.params.article_id
			})
			.save({
				id: req.body.id,
				title: req.body.title,
				body: req.body.body
			}, {
				patch: true
			})
			.then(function(info) {
				res.status(200).json({
					success: true,
					data: info
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		remove : function (req, res, next) {
			new Info({
				id: req.params.info_id
			})
			.fetch({
				required: true
			})
			.then(function(info) {
				info.destroy()
				.then(function() {
					res.status(200).json({
						success: true,
						data: info
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
