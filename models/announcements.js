// announcements uploaded by admin or doctors
var _ = require('lodash');

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

			Announcement.fetch({
				withRelated: [{'author': function(qb) {
					qb.column(
						'id',
						'user_name',
						'type',
						'name',
						'sex',
						'birth_day',
						'birth_month',
						'birth_year',
						'picture',
						'occupation',
						'hospital',
						'department',
						'city'
					);
				}}],
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
			new AnnouncementCollection()
			.parseQuery(req)
			.fetch({
				withRelated: [{'author': function(qb) {
					qb.column(
						'id',
						'user_name',
						'type',
						'name',
						'sex',
						'birth_day',
						'birth_month',
						'birth_year',
						'picture',
						'occupation',
						'hospital',
						'department',
						'city'
					);
				}}]
			})
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

			var updatedInfo = _({
				user_id: req.body.user_id,
				title: req.body.title,
				body: req.body.body,
				hospital: req.body.hospital,
				location: req.body.location
			}).omit(_.isUndefined).value();

			Announcement.authenticate(req, res)
			.then(function(authed) {

				Announcement.save(updatedInfo, {
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
