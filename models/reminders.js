// reminders for users

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var Reminder = require('../lib/models')(app).Reminder;
	var Reminders = require('../lib/collections')(app).Reminders;

	return {

		create : function (req, res, next) {
			new Reminder({
				user_id: req.params.user_id,
				time: req.body.time,
				active: 'Y'
			})
			.save()
			.then(function(reminder) {
				res.status(200).json({
					success: true,
					data: reminder
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		show : function (req, res, next) {
			new Reminder({
				id: req.params.reminder_id,
				user_id: req.params.user_id
			})
			.fetch({
				require: true
			})
			.then(function(reminder) {
				res.status(200).json({
					success: true,
					data: reminder
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		list : function (req, res, next) {
			new Reminders({
				user_id: req.params.user_id
			})
			.fetch()
			.then(function(reminders) {
				res.status(200).json({
					success: true,
					data: reminders
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		update : function (req, res, next) {
			new Reminder({
				id: req.params.reminder_id
			})
			.save({
				user_id: req.body.user_id,
				time: req.body.time
			}, {
				patch: true
			})
			.then(function(reminder) {
				res.status(200).json({
					success: true,
					data: reminder
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		remove : function (req, res, next) {
			new Reminder({
				id: req.params.reminder_id
			})
			.save({
				active: 'N'
			}, {
				patch: true
			})
			.then(function(reminder) {
				res.status(200).json({
					success: true,
					data: reminder
				});
			})
			.catch(function(error) {
				next(error);
			});
		}
	};
};
