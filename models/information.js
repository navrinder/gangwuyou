// static info
var _ = require('lodash');

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var InfoModel = require('../lib/models')(app).InfoModel;
	var InfoCollection = require('../lib/collections')(app).InfoCollection;

	return {

		create : function (req, res, next) {
			new InfoModel({
				os: req.params.os,
				version: req.body.version,
				url: req.body.url
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

		showLatest : function (req, res, next) {
			InfoModel
			.where({
				os: req.params.os
			})
			.query(function (qb) {
				qb.orderBy('created_at', 'DESC');
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
			new InfoCollection()
			.parseQuery(req)
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
		}

		// update : function (req, res, next) {
		// 	var updatedInfo = _({
		// 		id: req.body.id,
		// 		title: req.body.title,
		// 		body: req.body.body
		// 	}).omit(_.isUndefined).value();

		// 	new InfoModel({
		// 		id: req.params.article_id
		// 	})
		// 	.save(updatedInfo, {
		// 		patch: true
		// 	})
		// 	.then(function(info) {
		// 		res.status(200).json({
		// 			success: true,
		// 			data: info
		// 		});
		// 	})
		// 	.catch(function(error) {
		// 		next(error);
		// 	});
		// },

		// remove : function (req, res, next) {
		// 	new InfoModel({
		// 		id: req.params.info_id
		// 	})
		// 	.fetch({
		// 		required: true
		// 	})
		// 	.then(function(info) {
		// 		info.destroy()
		// 		.then(function() {
		// 			res.status(200).json({
		// 				success: true,
		// 				data: info
		// 			});
		// 		})
		// 		.catch(function(error) {
		// 			return next(error);
		// 		});
		// 	})
		// 	.catch(function(error) {
		// 		next(error);
		// 	});
		// }
	};
};
