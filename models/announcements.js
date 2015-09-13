// announcements uploaded by admin or doctors

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var AnnouncementModel = require('../lib/models')(app).AnnouncementModel;
	var AnnouncementCollection = require('../lib/collections')(app).AnnouncementCollection;

	return {

		create : function (req, res, next) {
			var Announcement = new AnnouncementModel({
				user_id: req.body.user_id,
				title: req.body.title,
				body: req.body.body,
				hospital: req.body.hospital,
				location: req.body.location,
				active: 'Y'
			});

			Announcement.authenticate(req, res)
			.then(function(authed) {

				Announcement.save()
				.then(function(announcement) {
					res.status(200).json({
						success: true,
						data: announcement
					});
				})
				.catch(function(error) {
					next(error);
				});

			})
			.catch(function(error) {
				// authentication errors are caught here
				next(error);
			});
		},

		show : function (req, res, next) {
			var Announcement = new AnnouncementModel({
				id: req.params.announcement_id
			});

			Announcement.authenticate(req, res)
			.then(function(authed) {

				Announcement.fetch({
					withRelated: ['author'],
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

			})
			.catch(function(error) {
				// authentication errors are caught here
				next(error);
			});
		},

		list : function (req, res, next) {
			var query = {};
			if (req.query.limit) {
				query.limit = +req.query.limit;
				delete req.query.limit;
			}
			if (req.query.offset) {
				query.offset = +req.query.offset;
				delete req.query.offset;
			}
			query.where = req.query || {};

			new AnnouncementCollection()
			.query(query)
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
			var Announcement = new AnnouncementModel({
				id: req.params.announcement_id
			});

			Announcement.authenticate(req, res)
			.then(function(authed) {

				Announcement.save({
					user_id: req.body.user_id,
					title: req.body.title,
					body: req.body.body,
					hospital: req.body.hospital,
					location: req.body.location
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

			})
			.catch(function(error) {
				// authentication errors are caught here
				next(error);
			});
		},

		remove : function (req, res, next) {
			var Announcement = new AnnouncementModel({
				id: req.params.announcement_id
			});

			Announcement.authenticate(req, res)
			.then(function(authed) {

				Announcement.save({
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

			})
			.catch(function(error) {
				// authentication errors are caught here
				next(error);
			});
		}
	};
};
