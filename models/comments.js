// comments for articles

module.exports = function(app) {
	var knex = app.get('knex');

	return {

		create : function (req, res, next) {
			knex('comments')
				.insert({
					article_id: req.params.article_id,
					user_id	: req.body.user_id,
					title: req.body.title,
					body: req.body.body,
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

		showComment : function (req, res, next) {
			knex.select('*')
				.from('comments')
				.where({ id: req.params.comment_id })
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

		showUserComments : function (req, res, next) {
			knex.select('*')
				.from('comments')
				.where({ user_id: req.params.user_id })
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

		showArticleComments : function (req, res, next) {
			knex.select('*')
				.from('comments')
				.where({ article_id: req.params.article_id })
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
			knex('comments')
				.where({ id: req.params.comment_id })
				.update({
					article_id: req.params.article_id,
					user_id: req.body.user_id,
					title: req.body.title,
					body: req.body.body,
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
