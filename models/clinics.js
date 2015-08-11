// information for clinics and hospitals

module.exports = function(app) {
	var Bookshelf = app.get('Bookshelf');
	var ClinicModel = require('../lib/models')(app).ClinicModel;
	var ClinicCollection = require('../lib/collections')(app).ClinicCollection;

	return {

		create : function (req, res, next) {
			var Clinic = new ClinicModel({
				name: req.body.name,
				address_1: req.body.address_1,
				address_2: req.body.address_2,
				address_3: req.body.address_3,
				city: req.body.city,
				province: req.body.province,
				postal_code: req.body.postal_code,
				description: req.body.description,
				picture: req.body.picture,
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
			var Clinic = new ClinicModel({
				id: req.params.clinic_id
			});

			Clinic.authenticate(req, res)
			.then(function(authed) {

				Clinic.fetch({
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
			var Clinic = new ClinicModel({
				id: req.params.clinic_id
			});

			Clinic.authenticate(req, res)
			.then(function(authed) {

				Clinic.save({
					name: req.body.name,
					address_1: req.body.address_1,
					address_2: req.body.address_2,
					address_3: req.body.address_3,
					city: req.body.city,
					province: req.body.province,
					postal_code: req.body.postal_code,
					description: req.body.description,
					picture: req.body.picture
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
