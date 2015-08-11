// information for doctors and hospitals

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var DoctorModel = require('../lib/models')(app).DoctorModel;
	var DoctorCollection = require('../lib/collections')(app).DoctorCollection;

	return {

		create : function (req, res, next) {
			var Doctor = new DoctorModel({
				name: req.body.name,
				clinic_id: req.params.clinic_id,
				position: req.params.position,
				picture: req.params.picture,
				hours: req.params.hours,
				active: 'Y'
			});

			Doctor.authenticate(req, res)
			.then(function(authed) {

				Doctor.save()
				.then(function(doctor) {
					res.status(200).json({
						success: true,
						data: doctor
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
			var Doctor = new DoctorModel({
				id: req.params.Doctor_id
			});

			Doctor.authenticate(req, res)
			.then(function(authed) {

				Doctor.fetch({
					require: true
				})
				.then(function(doctor) {
					res.status(200).json({
						success: true,
						data: doctor
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
			new DoctorCollection()
			.fetch()
			.then(function(doctors) {
				res.status(200).json({
					success: true,
					data: doctors
				});
			})
			.catch(function(error) {
				next(error);
			});
		},

		update : function (req, res, next) {
			var Doctor = new DoctorModel({
				id: req.params.Doctor_id
			});

			Doctor.authenticate(req, res)
			.then(function(authed) {

				Doctor.save({
					name: req.body.name,
					clinic_id: req.params.clinic_id,
					position: req.params.position,
					picture: req.params.picture,
					hours: req.params.hours
				}, {
					patch: true
				})
				.then(function(doctor) {
					res.status(200).json({
						success: true,
						data: doctor
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
			var Doctor = new DoctorModel({
				id: req.params.Doctor_id
			});

			Doctor.authenticate(req, res)
			.then(function(authed) {

				Doctor.save({
					active: 'N'
				}, {
					patch: true
				})
				.then(function(doctor) {
					res.status(200).json({
						success: true,
						data: doctor
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
