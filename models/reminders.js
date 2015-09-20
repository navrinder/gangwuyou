// reminders for users
var _ = require('lodash');

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var ReminderModel = require('../lib/models')(app).ReminderModel;
	var ReminderCollection = require('../lib/collections')(app).ReminderCollection;

	return {

		create : function (req, res, next) {
			var Reminder = new ReminderModel({
				user_id: req.params.user_id,
				day: req.body.day,
				time: req.body.time,
				medicine: req.body.medicine,
				pad: req.body.pad,
				medicine_name: req.body.medicine_name,
				daily: req.body.daily,
				weekly: req.body.weekly,
				therapy_start_date: req.body.therapy_start_date,
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
			var query = {
				where : { user_id: req.params.user_id	}
			};

			// reminders must be authenticated for currentUser scope
			var Reminders = new ReminderCollection({
			}).query(query);

			Reminders.authenticate(req, res)
			.then(function(authed) {

				Reminders.parseQuery(req, query)
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
			})
			.catch(function(error) {
				next(error);
			});
		},

		update : function (req, res, next) {
			var Reminder = new ReminderModel({
				id: req.params.reminder_id
			});

			var updatedInfo = _({
				user_id: req.body.user_id,
				day: req.body.day,
				time: req.body.time,
				medicine: req.body.medicine,
				pad: req.body.pad,
				medicine_name: req.body.medicine_name,
				daily: req.body.daily,
				weekly: req.body.weekly,
				therapy_start_date: req.body.therapy_start_date
			}).omit(_.isUndefined).value();

			Reminder.authenticate(req, res)
			.then(function(authed) {

				Reminder.save(updatedInfo, {
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

			Reminder.authenticate(req, res)
			.then(function(authed) {

				Reminder.fetch()
				.then(function(reminder) {
					reminder.destroy()
					.then(function() {
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
			})
			.catch(function(error) {
				next(error);
			});
		}
	};
};
