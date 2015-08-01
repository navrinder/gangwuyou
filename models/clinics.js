// information for clinics and hospitals

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var Clinic = require('../lib/models')(app).Clinic;
	var Clinics = require('../lib/collections')(app).Clinics;

	return {

		create : function (req, res, next) {
			new Clinic({
				name: req.body.name,
				location: req.body.location,
				hours: req.body.hours,
				active: 'Y'
			})
			.save()
			.then(function(clinic) {
				res.status(200).json({
					success: true,
					data: clinic
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		show : function (req, res, next) {
			new Clinic({
				id: req.params.clinic_id
			})
			.fetch({
				require: true
			})
			.then(function(clinic) {
				res.status(200).json({
					success: true,
					data: clinic
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		list : function (req, res, next) {
			new Clinics()
			.fetch()
			.then(function(clinics) {
				res.status(200).json({
					success: true,
					data: clinics
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		update : function (req, res, next) {
			new Clinic({
				id: req.params.clinic_id
			})
			.save({
				name: req.body.name,
				location: req.body.location,
				hours: req.body.hours
			}, {
				patch: true
			})
			.then(function(clinic) {
				res.status(200).json({
					success: true,
					data: clinic
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		remove : function (req, res, next) {
			new Clinic({
				id: req.params.clinic_id
			})
			.save({
				active: 'N'
			}, {
				patch: true
			})
			.then(function(clinic) {
				res.status(200).json({
					success: true,
					data: clinic
				});
			})
			.catch(function(error) {
				next(error);
			});
		}
	};
};
