// this can be used to verify that a doctor's account is valid

module.exports = function(app) {
	var knex = app.get('knex');

	return {

		verifyAccount : function (req, res, next) {
			knex('users')
				.where({ id: req.params.user_id })
				.update({
					verified: 'Y'
				})
				.then(function(rows) {
					res.status(200).send('Account verified ' + rows);
				})
				.catch(function(error) {
					next(error);
				});
		}
	};
};
