// these are used to store user's answers in the database

module.exports = function(app) {
	var knex = app.get('knex');

	return {

		show : function (req, res, next) {
			knex.select(
					'question_1, ' +
					'question_2, ' +
					'question_3, ' +
					'question_4, ' +
					'quesiton_5, ' +
					'question_6, ' +
					'question_7, ' +
					'question_8, ' +
					'question_9, ' +
					'question_10, ' +
					'question_11, ' +
					'question_12'
				)
				.from('users')
				.where({ user_id: user_id })
				.then(function(rows) {
					res.status(200).json(rows);
				})
				.catch(function(error) {
					next(error);
				});
		},

		updateAnswers : function (req, res, next) {
			var payload = {};

			if (req.body.question_1) {
				payload.question_1 = req.body.question_1;
			}
			if (req.body.question_2) {
				payload.question_2 = req.body.question_2;
			}
			if (req.body.question_3) {
				payload.question_3 = req.body.question_3;
			}
			if (req.body.question_4) {
				payload.question_4 = req.body.question_4;
			}
			if (req.body.question_5) {
				payload.question_5 = req.body.question_5;
			}
			if (req.body.question_6) {
				payload.question_6 = req.body.question_6;
			}
			if (req.body.question_7) {
				payload.question_7 = req.body.question_7;
			}
			if (req.body.question_8) {
				payload.question_8 = req.body.question_8;
			}
			if (req.body.question_9) {
				payload.question_9 = req.body.question_9;
			}
			if (req.body.question_10) {
				payload.question_10 = req.body.question_10;
			}
			if (req.body.question_11) {
				payload.question_11 = req.body.question_11;
			}
			if (req.body.question_12) {
				payload.question_12 = req.body.question_12;
			}

			knex('users')
				.where({ id: req.params.user_id })
				.update(payload)
				.then(function(rows) {
					res.status(200).send('Success ' + rows);
				})
				.catch(function(error) {
					next(error);
				});
		},
	};
};
