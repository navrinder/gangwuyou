var jwt = require('jwt-simple');

// this middleware can be used to check the scope of a user's token
// to see if they have correct permissions
module.exports = function (app) {
	var secret = app.get('config').secret;

	return function (routeScopes) {
		return function (req, res, next) {
			var authorization = req.headers.authorization || '';
			var token = authorization.trim();
			var decoded;
			var authorized = false;

			// this stores the user's info in the res object to be verified later
			res.locals.currentUser = {
				token: null,
				needsAuth: false
			};

			// decode JSON web token
			if (token) {
				try {
					decoded = jwt.decode(token, secret);
				} catch (e) {
					e.status = 401;
					return next(e);
				}
			}

			// compare scopes in token with scopes in middleware to find match
			if (decoded && decoded.scopes && decoded.scopes.length) {
				res.locals.currentUser.token = decoded;

				for (var i = 0, l = decoded.scopes.length; i < l; i++) {
					for (var j = 0, m = routeScopes.length; j < m; j++) {
						if (routeScopes[j] === 'currentUser') {
							res.locals.currentUser.needsAuth = true;
						} else if (!authorized && decoded.scopes[i] === routeScopes[j]) {
							authorized = true;
						}
					}
				}
			}


			if (authorized) {
				// if user is authorized, per user authentication is not needed
				res.locals.currentUser.needsAuth = false;
				return next();
			} else if (!authorized && res.locals.currentUser.needsAuth) {
				// check user authentication in model
				return next();
			} else {
				return next({
					status: 401,
					message: 'Unauthorized user token.'
				});
			}
		};
	};
};
