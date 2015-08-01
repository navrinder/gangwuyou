// announcements uploaded by admin or doctors

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var Announcement = require('../lib/models')(app).Announcement;
	var Announcements = require('../lib/collections')(app).Announcements;

	return {

		create : function (req, res, next) {
			new Announcement({
				user_id: req.body.user_id,
				title: req.body.title,
				body: req.body.body,
				active: 'Y'
			})
			.save()
			.then(function(announcement) {
				res.status(200).json({
					success: true,
					data: announcement
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		show : function (req, res, next) {
			new Announcement({
				id: req.params.announcement_id
			})
			.fetch({
				require: true
			})
			.then(function(announcement) {
				res.status(200).json({
					success: true,
					data: announcement
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		list : function (req, res, next) {
			new Announcements()
			.fetch()
			.then(function(announcements) {
				res.status(200).json({
					success: true,
					data: announcements
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		update : function (req, res, next) {
			new Announcement({
				id: req.params.announcement_id
			})
			.save({
				user_id: req.body.user_id,
				title: req.body.title,
				body: req.body.body
			}, {
				patch: true
			})
			.then(function(announcement) {
				res.status(200).json({
					success: true,
					data: announcement
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		remove : function (req, res, next) {
			new Announcement({
				id: req.params.announcement_id
			})
			.save({
				active: 'N'
			}, {
				patch: true
			})
			.then(function(announcement) {
				res.status(200).json({
					success: true,
					data: announcement
				});
			})
			.catch(function(error) {
				next(error);
			});
		}
	};
};
