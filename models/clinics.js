// information for clinics and hospitals
var form = require('../lib/form');

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var ClinicModel = require('../lib/models')(app).ClinicModel;
	var ClinicCollection = require('../lib/collections')(app).ClinicCollection;

	return {

		create : function (req, res, next) {
			var inForm = form.buildForm();

			inForm.parse(req, function (err, fields, files) {
				if (err) {
					return next(err);
				}

				var picture = files.picture;

				form.checkPicture(picture, function (error) {
					if (error) {
						return next(error);
					} else {
						var cleanup = form.cleanup(picture, next);
						var Clinic = new ClinicModel({
							name: fields.name,
							address_1: fields.address_1,
							address_2: fields.address_2,
							address_3: fields.address_3,
							city: fields.city,
							province: fields.province,
							postal_code: fields.postal_code,
							description: fields.description,
							picture: picturePath,
							latitude: fields.latitude,
							longitude: fields.longitude,
							active: 'Y'
						});

						Clinic.authenticate(req, res)
						.then(function(authed) {

							Clinic.save()
							.then(function(clinic) {
								res.status(200).json({
									success: true,
									data: clinic
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
			var Clinic = new ClinicModel({
				id: req.params.clinic_id
			});

			Clinic.authenticate(req, res)
			.then(function(authed) {

				Clinic.fetch({
					withRelated: ['doctors'],
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

			})
			.catch(function(error) {
				// authentication errors are caught here
				next(error);
			});
		},

		list : function (req, res, next) {
			new ClinicCollection()
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
			var inForm = form.buildForm();

			inForm.parse(req, function (err, fields, files) {
				if (err) {
					return next(err);
				}

				var picture = files.picture;
				form.checkPicture(picture, function (error) {
					if (error) {
						return next(error);
					} else {
						var cleanup = form.cleanup(picture, next);
						var Clinic = new ClinicModel({
							id: req.params.clinic_id
						});

						Clinic.authenticate(req, res)
						.then(function(authed) {

							Clinic.save({
								name: fields.name,
								address_1: fields.address_1,
								address_2: fields.address_2,
								address_3: fields.address_3,
								city: fields.city,
								province: fields.province,
								postal_code: fields.postal_code,
								description: fields.description,
								picture: picturePath,
								latitude: fields.latitude,
								longitude: fields.longitude
							}, {
								patch: true
							})
							.then(function(clinic) {
								res.status(200).json({
									success: true,
									data: clinic
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
			var Clinic = new ClinicModel({
				id: req.params.clinic_id
			});

			Clinic.authenticate(req, res)
			.then(function(authed) {

				Clinic.save({
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

			})
			.catch(function(error) {
				// authentication errors are caught here
				next(error);
			});
		}
	};
};
