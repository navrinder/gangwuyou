// articles uploaded by admin or doctors

module.exports = function(app) {
	var knex = app.get('knex');

	return {

		create : function (req, res, next) {
			knex('articles')
				.insert({
					user_id: req.body.user_id,
					title: req.body.title,
					body: req.body.body,
					category: req.body.category,
					created_at: knex.raw('NOW()'),
					active: 'Y'
				})
				.then(function(id) {
					res.status(200).json({
						success: true,
						data: id
					});
				})
				.catch(function(error) {
					next(error);
				});
		},

		show : function (req, res, next) {
			knex.select('*')
				.from('articles')
				.where({ id: req.params.article_id })
				.then(function(rows) {
					res.status(200).json({
						success: true,
						data: rows
					});
				})
				.catch(function(error) {
					next(error);
				});
		},

		list : function (req, res, next) {
			knex.select('*')
				.from('articles')
				.limit(req.body.limit || 10)
				.then(function(rows) {
					res.status(200).json({
						success: true,
						data: rows
					});
				})
				.catch(function(error) {
					next(error);
				});
		},

		update : function (req, res, next) {
			knex('articles')
				.where({ id: req.params.article_id })
				.update({
					user_id: req.body.user_id,
					title: req.body.title,
					body: req.body.body,
					category: req.body.category,
					updated_at: knex.raw('NOW()')
				})
				.then(function(id) {
					res.status(200).json({
						success: true,
						data: id
					});
				})
				.catch(function(error) {
					next(error);
				});
		},

		remove : function (req, res, next) {
			knex('articles')
				.where({ id: req.params.article_id })
				.update({ active: 'N' })
				.then(function(rows) {
					res.status(200).json({
						success: true,
						data: rows
					});
				})
				.catch(function(error) {
					next(error);
				});
		}
	};
};
