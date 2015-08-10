// reminders for users

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var ReminderModel = require('../lib/models')(app).ReminderModel;
	var ReminderCollection = require('../lib/collections')(app).ReminderCollection;

	return {

		create : function (req, res, next) {
			var Reminder = new ReminderModel({
				user_id: req.params.user_id,
				time: req.body.time,
				active: 'Y'
			});

			Reminder.authenticate(req, res)
			.then(function(authed) {

				Reminder.save()
				.then(function(reminder) {
					res.status(200).json({
						success: true,
						data: reminder
					});
				})
				.catch(function(error) {
					next(error);
				});

			})
			.catch(function(error) {
				next(error);
			});
		},

		show : function (req, res, next) {
			var Reminder = new ReminderModel({
				id: req.params.reminder_id,
				user_id: req.params.user_id
			});

			Reminder.authenticate(req, res)
			.then(function(authed) {

				Reminder.fetch({
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
			})

			.catch(function(error) {
				next(error);
			});
		},

		list : function (req, res, next) {
			var Reminders = new ReminderCollection({
				user_id: req.params.user_id
			});

			Reminders.authenticate(req, res)
			.then(function(authed) {

				Reminders.fetch()
				.then(function(reminders) {
					res.status(200).json({
						success: true,
						data: reminders
					});
				})
				.catch(function(error) {
					next(error);
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		update : function (req, res, next) {
			var Reminder = new ReminderModel({
				id: req.params.reminder_id
			});

			Reminders.authenticate(req, res)
			.then(function(authed) {

				Reminders.save({
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

			})
			.catch(function(error) {
				next(error);
			});
		},

		remove : function (req, res, next) {
			var Reminder = new ReminderModel({
				id: req.params.reminder_id
			});

			Reminders.authenticate(req, res)
			.then(function(authed) {

				Reminders.save({
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
			})
			.catch(function(error) {
				next(error);
			});
		}
	};
};
