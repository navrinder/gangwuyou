// information for clinics and hospitals
var form = require('../lib/form');
var _ = require('lodash');

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

				form.checkPicture(picture, function (error, picturePath) {
					if (error) {
						return next(error);
					} else {
						var cleanup = form.cleanup(picture, next);
						var Clinic = new ClinicModel({
							name: fields.name,
							address_1: fields.address_1,
							address_2: fields.address_2,
							address_3: fields.address_3,
							district: fields.district,
							city: fields.city,
							province: fields.province,
							postal_code: fields.postal_code,
							description: fields.description,
							picture: picturePath,
							latitude: fields.latitude,
							longitude: fields.longitude,
							website: fields.website,
							telephone_1: fields.telephone_1,
							telephone_name_1: fields.telephone_name_1,
							telephone_2: fields.telephone_2,
							telephone_name_2: fields.telephone_name_2,
							telephone_3: fields.telephone_3,
							telephone_name_3: fields.telephone_name_3,
							telephone_4: fields.telephone_4,
							telephone_name_4: fields.telephone_name_4,
							telephone_5: fields.telephone_5,
							telephone_name_5: fields.telephone_name_5,
							telephone_6: fields.telephone_6,
							telephone_name_6: fields.telephone_name_6,
							transportation_1: fields.transportation_1,
							transportation_2: fields.transportation_2,
							transportation_3: fields.transportation_3,
							transportation_4: fields.transportation_4,
							transportation_5: fields.transportation_5,
							transportation_6: fields.transportation_6,
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
		},

		list : function (req, res, next) {
			new ClinicCollection()
			.parseQuery(req)
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

						var updatedInfo = _({
							name: fields.name,
							address_1: fields.address_1,
							address_2: fields.address_2,
							address_3: fields.address_3,
							district: fields.district,
							city: fields.city,
							province: fields.province,
							postal_code: fields.postal_code,
							description: fields.description,
							picture: picturePath,
							latitude: fields.latitude,
							longitude: fields.longitude,
							website: fields.website,
							telephone_1: fields.telephone_1,
							telephone_name_1: fields.telephone_name_1,
							telephone_2: fields.telephone_2,
							telephone_name_2: fields.telephone_name_2,
							telephone_3: fields.telephone_3,
							telephone_name_3: fields.telephone_name_3,
							telephone_4: fields.telephone_4,
							telephone_name_4: fields.telephone_name_4,
							telephone_5: fields.telephone_5,
							telephone_name_5: fields.telephone_name_5,
							telephone_6: fields.telephone_6,
							telephone_name_6: fields.telephone_name_6,
							transportation_1: fields.transportation_1,
							transportation_2: fields.transportation_2,
							transportation_3: fields.transportation_3,
							transportation_4: fields.transportation_4,
							transportation_5: fields.transportation_5,
						}).omit(_.isUndefined).value();

						Clinic.authenticate(req, res)
						.then(function(authed) {

							Clinic.save(updatedInfo, {
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
