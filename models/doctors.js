// information for doctors and hospitals
var form = require('../lib/form');

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var DoctorModel = require('../lib/models')(app).DoctorModel;
	var DoctorCollection = require('../lib/collections')(app).DoctorCollection;

	return {

		create : function (req, res, next) {
			var inForm = form.buildForm();

			inForm.parse(req, function (err, fields, files) {
				if (err) {
					return next(err);
				}

				var picture = files.picture;
				form.checkPicture(picture, function (error, picturePath) {
					if (error) {
						return next(error);
					} else {
						var cleanup = form.cleanup(picture, next);
						var Doctor = new DoctorModel({
							name: fields.name,
							clinic_id: req.params.clinic_id,
							position: fields.position,
							picture: picturePath,
							hours: fields.hours,
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
							.catch(cleanup);
						})
						.catch(cleanup);
					}
				});
			});
		},

		show : function (req, res, next) {
			var Doctor = new DoctorModel({
				id: req.params.doctor_id
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
			var query = {
				where: { clinic_id: req.params.clinic_id	}
			};

			new DoctorCollection()
			.parseQuery(req, query)
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
			var inForm = form.buildForm();

			inForm.parse(req, function (err, fields, files) {
				if (err) {
					return next(err);
				}

				var picture = files.picture;
				form.checkPicture(picture, function (error, picturePath) {
					if (error) {
						return next(error);
					} else {
						var cleanup = form.cleanup(picture, next);
						var Doctor = new DoctorModel({
							id: req.params.Doctor_id
						});

						Doctor.authenticate(req, res)
						.then(function(authed) {

							Doctor.save({
								name: fields.name,
								clinic_id: req.params.clinic_id,
								position: fields.position,
								picture: picturePath,
								hours: fields.hours
							}, {
								patch: true
							})
							.then(function(doctor) {
								res.status(200).json({
									success: true,
									data: doctor
								});
							})
							.catch(cleanup);
						})
						.catch(cleanup);
					}
				});
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
